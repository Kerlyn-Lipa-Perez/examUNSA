import { Controller, Post, Get, Body, UseGuards, Request, Param, Query, NotFoundException } from '@nestjs/common';
import { SimulacrosService } from './simulacros.service';
import { GenerarSimulacroDto } from './dto/generar-simulacro.dto';
import { GuardarResultadoDto } from './dto/guardar-resultado.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('simulacros')
export class SimulacrosController {
  constructor(private readonly simulacrosService: SimulacrosService) {}

  @Post('generar')
  async generar(@Request() req: any, @Body() dto: GenerarSimulacroDto) {
    return this.simulacrosService.generar(req.user.userId, dto);
  }

  @Post('resultado')
  async guardarResultado(@Request() req: any, @Body() dto: GuardarResultadoDto) {
    return this.simulacrosService.guardarResultado(req.user.userId, dto);
  }

  @Get('resultado/:id')
  async getResultado(@Request() req: any, @Param('id') id: string) {
    const resultado = await this.simulacrosService.getResultado(req.user.userId, id);
    if (!resultado) throw new NotFoundException('Resultado no encontrado');
    return resultado;
  }

  @Get('historial')
  async historial(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = Math.max(1, parseInt(page || '1', 10) || 1);
    const l = Math.min(50, Math.max(1, parseInt(limit || '10', 10) || 10));
    return this.simulacrosService.historial(req.user.userId, p, l);
  }

  @Get('historial/:examId')
  async historialPorExamen(
    @Request() req: any,
    @Param('examId') examId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = Math.max(1, parseInt(page || '1', 10) || 1);
    const l = Math.min(50, Math.max(1, parseInt(limit || '10', 10) || 10));
    return this.simulacrosService.historialPorExamen(req.user.userId, examId, p, l);
  }
}