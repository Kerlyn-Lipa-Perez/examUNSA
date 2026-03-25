import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
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

  @Get('historial')
  async historial(@Request() req: any) {
    return this.simulacrosService.historial(req.user.userId);
  }

  @Get('historial/:examId')
  async historialPorExamen(@Request() req: any, @Param('examId') examId: string) {
    return this.simulacrosService.historialPorExamen(req.user.userId, examId);
  }
}