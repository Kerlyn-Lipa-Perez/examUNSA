// backend/src/ranking/ranking.module.ts
import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { RankingCalculationService } from './ranking-calculation.service';

@Module({
  controllers: [RankingController],
  providers: [RankingService, RankingCalculationService],
  exports: [RankingService, RankingCalculationService],
})
export class RankingModule {}
