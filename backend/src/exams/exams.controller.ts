// backend/src/exams/exams.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ExamsService } from './exams.service';

// Catálogo de preguntas de admisión: datos públicos de solo lectura, sin auth
// (los archivos estáticos que reemplaza tampoco requerían autenticación).
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get('UNSA/:area')
  async getExamsByArea(@Param('area') area: string) {
    return this.examsService.getExamsByArea(area);
  }

  @Get('UNSA/:area/:examId')
  async getExamById(@Param('area') area: string, @Param('examId') examId: string) {
    return this.examsService.getExamById(area, examId);
  }
}
