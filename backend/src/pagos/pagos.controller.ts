import { Controller, Post, Body, UseGuards, Request, HttpCode } from '@nestjs/common';
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

  // El webhook no usa JwtAuthGuard porque lo llama Culqi externamente
  @Post('webhook')
  @HttpCode(200)
  async procesarWebhook(@Body() payload: any) {
    return this.pagosService.procesarWebhook(payload);
  }
}