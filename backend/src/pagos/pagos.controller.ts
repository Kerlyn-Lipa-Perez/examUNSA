import { Controller, Post, Get, Body, UseGuards, Request, HttpCode } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async crearCheckout(@Request() req: any, @Body('planId') planId: string) {
    return this.pagosService.crearCheckout(req.user.userId, planId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('historial')
  async getHistorial(@Request() req: any) {
    return this.pagosService.getHistorial(req.user.userId);
  }

  // El webhook no usa JwtAuthGuard porque lo llama Culqi externamente
  @Post('webhook')
  @HttpCode(200)
  async procesarWebhook(@Body() payload: any) {
    return this.pagosService.procesarWebhook(payload);
  }
}