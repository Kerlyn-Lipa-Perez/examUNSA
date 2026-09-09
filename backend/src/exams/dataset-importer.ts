import { sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';

export interface CsvRow {
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

const AREA_MAP: Record<string, string> = {
  Biomedicas: 'biomedicas',
  Ingenieria: 'ingenierias',
  Sociales: 'sociales',
};

export interface FilterResult {
  toInsert: schema.NewExamQuestion[];
  skippedNoAnswer: number;
  skippedOther: number;
}

export type ExamQuestionDatabase = Pick<NodePgDatabase<typeof schema>, 'insert'>;

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
  return trimmed?.toLowerCase() === 'true';
}

export function filterAndMap(rows: CsvRow[]): FilterResult {
  const toInsert: schema.NewExamQuestion[] = [];
  let skippedNoAnswer = 0;
  let skippedOther = 0;

  for (const row of rows) {
    const respuesta = nullIfEmpty(row.respuesta);
    if (respuesta === null) {
      skippedNoAnswer++;
      continue;
    }

    const id = nullIfEmpty(row.id);
    const respuestaCorrecta = respuesta.toUpperCase();
    const facultad = nullIfEmpty(row.facultad);
    const pregunta = nullIfEmpty(row.pregunta);
    const area = facultad ? AREA_MAP[facultad] : undefined;

    if (!id || !area || !pregunta || !/^[A-E]$/.test(respuestaCorrecta)) {
      skippedOther++;
      continue;
    }

    toInsert.push({
      id,
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
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function excluded(column: string) {
  return sql.raw(`excluded.${column}`);
}

export async function persistExamQuestions(
  db: ExamQuestionDatabase,
  questions: schema.NewExamQuestion[],
  chunkSize = 100,
): Promise<void> {
  for (const batch of chunk(questions, chunkSize)) {
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
}
