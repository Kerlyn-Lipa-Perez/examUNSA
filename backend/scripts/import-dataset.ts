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
import * as schema from '../src/database/schema';
import {
  CsvRow,
  filterAndMap,
  persistExamQuestions,
} from '../src/exams/dataset-importer';

dotenv.config();

const CSV_PATH = path.resolve(__dirname, '../../dataset_final.csv');
const CHUNK_SIZE = 100;

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

    await persistExamQuestions(db, toInsert, CHUNK_SIZE);

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
