// backend/src/exams/exams.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';
import { ExamQuestion } from '../database/schema';
import { ExamMetaDto, ExamArea } from './dto/exam-meta.dto';
import { ExamDataDto } from './dto/exam-data.dto';
import { QuestionDto } from './dto/question.dto';

const VALID_AREAS: readonly ExamArea[] = ['ingenierias', 'sociales', 'biomedicas'];
const EXAM_ID = 'banco-preguntas';

@Injectable()
export class ExamsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
  ) {}

  /**
   * GET /exams/UNSA/:area
   * 404 si el área no es una de las 3 válidas.
   * [] si el área es válida pero no tiene preguntas importadas.
   * [ExamMeta] (un único "banco de preguntas" sintético) si hay datos.
   */
  async getExamsByArea(area: string): Promise<ExamMetaDto[]> {
    if (!this.isValidArea(area)) {
      throw new NotFoundException(`Área no válida: ${area}`);
    }

    const [row] = await this.db
      .select({
        total: sql<number>`count(*)::int`,
        maxAnio: sql<number | null>`max(${schema.examQuestions.anio})`,
      })
      .from(schema.examQuestions)
      .where(eq(schema.examQuestions.area, area));

    const total = row?.total ?? 0;
    if (total === 0) return [];

    return [this.buildMeta(area, total, row.maxAnio)];
  }

  /**
   * GET /exams/UNSA/:area/:examId
   * 404 si el área es inválida, si examId !== 'banco-preguntas', o si no hay preguntas.
   */
  async getExamById(area: string, examId: string): Promise<ExamDataDto> {
    if (!this.isValidArea(area) || examId !== EXAM_ID) {
      throw new NotFoundException('Examen no encontrado');
    }

    const rows = await this.db
      .select()
      .from(schema.examQuestions)
      .where(eq(schema.examQuestions.area, area));

    if (rows.length === 0) {
      throw new NotFoundException('Examen no encontrado');
    }

    const sorted = [...rows].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    const preguntas: QuestionDto[] = sorted.map((row, index) => this.mapRowToQuestion(row, index + 1));
    const years = rows.map((r) => r.anio).filter((y): y is number => y != null);
    const maxAnio = years.length > 0 ? Math.max(...years) : null;

    return {
      meta: this.buildMeta(area, rows.length, maxAnio),
      preguntas,
    };
  }

  private isValidArea(area: string): area is ExamArea {
    return (VALID_AREAS as readonly string[]).includes(area);
  }

  private buildMeta(area: ExamArea, totalPreguntas: number, maxAnio: number | null): ExamMetaDto {
    return {
      id: EXAM_ID,
      name: 'Banco de preguntas',
      area,
      university: 'UNSA',
      totalPreguntas,
      tiempoMinutos: Math.round(totalPreguntas * 1.875),
      description: 'Banco de preguntas reales de admisión UNSA',
      year: maxAnio ?? new Date().getFullYear(),
    };
  }

  private mapRowToQuestion(row: ExamQuestion, id: number): QuestionDto {
    const question: QuestionDto = {
      id,
      materia: row.materia ?? '',
      texto: row.pregunta,
      opciones: {
        A: row.alternativaA ?? '',
        B: row.alternativaB ?? '',
        C: row.alternativaC ?? '',
        D: row.alternativaD ?? '',
        E: row.alternativaE ?? '',
      },
      respuestaCorrecta: row.respuestaCorrecta as QuestionDto['respuestaCorrecta'],
    };

    if (row.figuraPath) {
      question.imagen = row.figuraPath;
    }

    return question;
  }
}
