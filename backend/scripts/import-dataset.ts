/**
 * One-off idempotent import of dataset_final.csv into the exam_questions table.
 *
 * Usage: pnpm db:import-dataset   (run from backend/)
 *
 * Reads the CSV from the repo root, parses it with csv-parse (RFC 4180 —
 * handles commas inside quoted fields), filters out rows without a valid
 * answer or with missing/invalid core fields, and upserts the rest into
 * `exam_questions` by `id` (natural key = CSV slug), so re-running the
 * script never creates duplicates.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as schema from '../src/database/schema';

dotenv.config();

const CSV_PATH = path.resolve(__dirname, '../../dataset_final.csv');
const CHUNK_SIZE = 100;

// CSV `facultad` values (as authored) → schema `area` enum values.
const AREA_MAP: Record<string, string> = {
  Biomedicas: 'biomedicas',
  Ingenieria: 'ingenierias',
  Sociales: 'sociales',
};

interface CsvRow {
  id: string;
  pregunta: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_e: string;
  respuesta: string;
  universidad: string;
  facultad: string;
  materia: string;
  tipo_examen: string;
  anio: string;
  fase: string;
  fuente_url: string;
  fuente_archivo: string;
  confianza_extraccion: string;
  revisado_manual: string;
  origen_archivo: string;
  figura_path: string;
}

/** Empty-string → null, otherwise trimmed value. */
function nullIfEmpty(value: string | undefined): string | null {
  const trimmed = (value ?? '').trim();
  return trimmed === '' ? null : trimmed;
}

function parseIntOrNull(value: string | undefined): number | null {
  const trimmed = nullIfEmpty(value);
  if (trimmed === null) return null;
  const parsed = parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseFloatOrNull(value: string | undefined): number | null {
  const trimmed = nullIfEmpty(value);
  if (trimmed === null) return null;
  const parsed = parseFloat(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseBoolOrDefault(value: string | undefined): boolean {
  const trimmed = nullIfEmpty(value);
  if (trimmed === null) return false;
  return trimmed.toLowerCase() === 'true';
}

interface FilterResult {
  toInsert: schema.NewExamQuestion[];
  skippedNoAnswer: number;
  skippedOther: number;
}

function filterAndMap(rows: CsvRow[]): FilterResult {
  const toInsert: schema.NewExamQuestion[] = [];
  let skippedNoAnswer = 0;
  let skippedOther = 0;

  for (const row of rows) {
    const respuesta = nullIfEmpty(row.respuesta);
    if (respuesta === null) {
      skippedNoAnswer++;
      continue;
    }

    const respuestaCorrecta = respuesta.toUpperCase();
    const facultad = nullIfEmpty(row.facultad);
    const pregunta = nullIfEmpty(row.pregunta);
    const area = facultad ? AREA_MAP[facultad] : undefined;

    if (!area || !pregunta || !/^[A-E]$/.test(respuestaCorrecta)) {
      skippedOther++;
      continue;
    }

    toInsert.push({
      id: row.id,
      area,
      materia: nullIfEmpty(row.materia),
      pregunta,
      alternativaA: nullIfEmpty(row.alternativa_a),
      alternativaB: nullIfEmpty(row.alternativa_b),
      alternativaC: nullIfEmpty(row.alternativa_c),
      alternativaD: nullIfEmpty(row.alternativa_d),
      alternativaE: nullIfEmpty(row.alternativa_e),
      respuestaCorrecta,
      universidad: nullIfEmpty(row.universidad) ?? 'UNSA',
      tipoExamen: nullIfEmpty(row.tipo_examen),
      anio: parseIntOrNull(row.anio),
      fase: nullIfEmpty(row.fase),
      fuenteUrl: nullIfEmpty(row.fuente_url),
      fuenteArchivo: nullIfEmpty(row.fuente_archivo),
      origenArchivo: nullIfEmpty(row.origen_archivo),
      confianzaExtraccion: parseFloatOrNull(row.confianza_extraccion),
      revisadoManual: parseBoolOrDefault(row.revisado_manual),
      figuraPath: nullIfEmpty(row.figura_path),
    });
  }

  return { toInsert, skippedNoAnswer, skippedOther };
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/** References the incoming row's value for `column` in an upsert `set` clause. */
function excluded(column: string) {
  return sql.raw(`excluded.${column}`);
}

async function main(): Promise<void> {
  const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  });
  const db = drizzle(pool, { schema });

  try {
    const raw = fs.readFileSync(CSV_PATH, 'utf8');
    const csvText = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    const rows: CsvRow[] = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    });

    const { toInsert, skippedNoAnswer, skippedOther } = filterAndMap(rows);

    for (const batch of chunk(toInsert, CHUNK_SIZE)) {
      await db
        .insert(schema.examQuestions)
        .values(batch)
        .onConflictDoUpdate({
          target: schema.examQuestions.id,
          set: {
            area: excluded('area'),
            materia: excluded('materia'),
            pregunta: excluded('pregunta'),
            alternativaA: excluded('alternativa_a'),
            alternativaB: excluded('alternativa_b'),
            alternativaC: excluded('alternativa_c'),
            alternativaD: excluded('alternativa_d'),
            alternativaE: excluded('alternativa_e'),
            respuestaCorrecta: excluded('respuesta_correcta'),
            universidad: excluded('universidad'),
            tipoExamen: excluded('tipo_examen'),
            anio: excluded('anio'),
            fase: excluded('fase'),
            fuenteUrl: excluded('fuente_url'),
            fuenteArchivo: excluded('fuente_archivo'),
            origenArchivo: excluded('origen_archivo'),
            confianzaExtraccion: excluded('confianza_extraccion'),
            revisadoManual: excluded('revisado_manual'),
            figuraPath: excluded('figura_path'),
          },
        });
    }

    const total = rows.length;
    const imported = toInsert.length;
    console.log('--- Import report ---');
    console.log(`imported: ${imported}`);
    console.log(`skipped-no-answer: ${skippedNoAnswer}`);
    console.log(`skipped-other: ${skippedOther}`);
    console.log(`total: ${total}`);
  } catch (err) {
    console.error('Import failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
