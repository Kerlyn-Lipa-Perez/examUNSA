// backend/src/ranking/ranking.controller.ts
import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  /**
   * GET /ranking/global
   * Top 100 usuarios por puntos de ranking acumulados.
   */
  @Get('global')
  async global(@Query('limit') limit?: string) {
    const l = Math.min(100, Math.max(1, parseInt(limit || '100', 10) || 100));
    return this.rankingService.getGlobalRanking(l);
  }

  /**
   * GET /ranking/posicion
   * Posición del usuario actual + vecinos (±5).
   */
  @Get('posicion')
  async posicion(@Request() req: any) {
    return this.rankingService.getUserPosition(req.user.userId);
  }

  /**
   * GET /ranking/semanal
   * Ranking de los últimos 7 días (motivacional).
   */
  @Get('semanal')
  async semanal(@Query('limit') limit?: string) {
    const l = Math.min(100, Math.max(1, parseInt(limit || '50', 10) || 50));
    return this.rankingService.getWeeklyRanking(l);
  }
}
