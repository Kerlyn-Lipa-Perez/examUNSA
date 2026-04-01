import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, Headers } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  // Frontend llama esto para obtener datos de configuración de CulqiCheckout
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async crearCheckout(@Request() req: any, @Body('planId') planId: string) {
    return this.pagosService.crearCheckout(req.user.userId, planId);
  }

  // Frontend llama esto después de que CulqiCheckout genera un token
  @UseGuards(JwtAuthGuard)
  @Post('confirmar')
  async confirmarPago(@Request() req: any, @Body('tokenId') tokenId: string) {
    return this.pagosService.confirmarPago(req.user.userId, tokenId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('historial')
  async getHistorial(@Request() req: any) {
    return this.pagosService.getHistorial(req.user.userId);
  }

  // Webhook de Culqi (sin autenticación JWT — lo llama Culqi externamente)
  @Post('webhook')
  @HttpCode(200)
  async procesarWebhook(
    @Body() payload: any,
    @Headers('x-culqi-signature') signature: string,
  ) {
    return this.pagosService.procesarWebhook(payload, signature);
  }
}
