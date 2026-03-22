import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { RevisarCardDto } from './dto/revisar-card.dto';
import { GenerarCardsDto } from './dto/generar-cards.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlanGuard } from '../auth/plan.guard';

@UseGuards(JwtAuthGuard)
@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Get('hoy')
  async getHoy(@Request() req: any) {
    return this.flashcardsService.getCardsHoy(req.user.userId);
  }

  @Post(':id/revisar')
  async revisar(@Request() req: any, @Param('id') id: string, @Body() dto: RevisarCardDto) {
    return this.flashcardsService.revisar(req.user.userId, id, dto);
  }

  @UseGuards(PlanGuard)
  @Post('generar-ia')
  async generarConIA(@Request() req: any, @Body() dto: GenerarCardsDto) {
    return this.flashcardsService.generarConIA(req.user.userId, dto);
  }

  @Get('stats')
  async stats(@Request() req: any) {
    return this.flashcardsService.stats(req.user.userId);
  }
}