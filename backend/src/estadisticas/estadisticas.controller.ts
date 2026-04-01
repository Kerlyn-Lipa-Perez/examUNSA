// backend/src/estadisticas/estadisticas.controller.ts
import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  /**
   * GET /estadisticas/evolucion?dias=30
   * Evolución de puntaje por materia a lo largo del tiempo.
   */
  @Get('evolucion')
  async evolucion(@Request() req: any, @Query('dias') dias?: string) {
    const d = Math.min(365, Math.max(7, parseInt(dias || '30', 10) || 30));
    return this.estadisticasService.getEvolucion(req.user.userId, d);
  }

  /**
   * GET /estadisticas/fortalezas
   * Análisis de fortalezas y debilidades por materia.
   */
  @Get('fortalezas')
  async fortalezas(@Request() req: any) {
    return this.estadisticasService.getFortalezas(req.user.userId);
  }

  /**
   * GET /estadisticas/actividad?semanas=12
   * Mapa de actividad (heatmap) por día.
   */
  @Get('actividad')
  async actividad(@Request() req: any, @Query('semanas') semanas?: string) {
    const s = Math.min(52, Math.max(4, parseInt(semanas || '12', 10) || 12));
    return this.estadisticasService.getActividad(req.user.userId, s);
  }

  /**
   * GET /estadisticas/por-dia
   * Rendimiento promedio agrupado por día de la semana.
   */
  @Get('por-dia')
  async porDia(@Request() req: any) {
    return this.estadisticasService.getPorDia(req.user.userId);
  }

  /**
   * GET /estadisticas/errores
   * Análisis de errores. Incluye análisis IA solo para plan Pro (con cache de 7 días).
   */
  @Get('errores')
  async errores(@Request() req: any) {
    return this.estadisticasService.getErrores(req.user.userId, req.user.plan);
  }

  /**
   * GET /estadisticas/comparativo
   * Comparación del usuario vs promedio global.
   */
  @Get('comparativo')
  async comparativo(@Request() req: any) {
    return this.estadisticasService.getComparativo(req.user.userId);
  }
}
