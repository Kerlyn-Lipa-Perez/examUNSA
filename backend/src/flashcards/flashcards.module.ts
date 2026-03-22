import { Module } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { FlashcardsController } from './flashcards.controller';
import { Sm2Service } from './sm2.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [FlashcardsController],
  providers: [FlashcardsService, Sm2Service],
})
export class FlashcardsModule {}