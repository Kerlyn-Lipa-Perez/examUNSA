import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';

describe('ExamsController (e2e-lite, Supertest)', () => {
  let app: INestApplication;
  let examsService: jest.Mocked<ExamsService>;

  const mockMeta = {
    id: 'banco-preguntas',
    name: 'Banco de preguntas',
    area: 'ingenierias',
    university: 'UNSA',
    totalPreguntas: 263,
    tiempoMinutos: 493,
    description: 'Banco de preguntas reales de admisión UNSA',
    year: 2023,
  };

  const mockExamData = {
    meta: mockMeta,
    preguntas: [
      {
        id: 1,
        materia: 'Matemática',
        texto: '¿Cuánto es 2+2?',
        opciones: { A: '3', B: '4', C: '5', D: '6', E: '7' },
        respuestaCorrecta: 'B',
      },
    ],
  };

  beforeEach(async () => {
    examsService = {
      getExamsByArea: jest.fn(),
      getExamById: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamsController],
      providers: [{ provide: ExamsService, useValue: examsService }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // ======= GET /exams/UNSA/:area =======
  describe('GET /exams/UNSA/:area', () => {
    it('200 con datos si el área es válida y tiene preguntas', async () => {
      examsService.getExamsByArea.mockResolvedValue([mockMeta as any]);

      const res = await request(app.getHttpServer()).get('/exams/UNSA/ingenierias');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockMeta]);
    });

    it('200 con [] si el área es válida pero no tiene preguntas', async () => {
      examsService.getExamsByArea.mockResolvedValue([]);

      const res = await request(app.getHttpServer()).get('/exams/UNSA/biomedicas');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('404 si el área no es válida', async () => {
      examsService.getExamsByArea.mockRejectedValue(new NotFoundException('Área no válida: foo'));

      const res = await request(app.getHttpServer()).get('/exams/UNSA/foo');

      expect(res.status).toBe(404);
    });
  });

  // ======= GET /exams/UNSA/:area/:examId =======
  describe('GET /exams/UNSA/:area/:examId', () => {
    it('200 con meta y preguntas si el examId es correcto y hay datos', async () => {
      examsService.getExamById.mockResolvedValue(mockExamData as any);

      const res = await request(app.getHttpServer()).get('/exams/UNSA/sociales/banco-preguntas');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockExamData);
    });

    it('404 si el examId es incorrecto', async () => {
      examsService.getExamById.mockRejectedValue(new NotFoundException('Examen no encontrado'));

      const res = await request(app.getHttpServer()).get('/exams/UNSA/ingenierias/otro-id');

      expect(res.status).toBe(404);
    });

    it('404 si el área no es válida, sin importar el examId', async () => {
      examsService.getExamById.mockRejectedValue(new NotFoundException('Examen no encontrado'));

      const res = await request(app.getHttpServer()).get('/exams/UNSA/foo/banco-preguntas');

      expect(res.status).toBe(404);
    });
  });
});
