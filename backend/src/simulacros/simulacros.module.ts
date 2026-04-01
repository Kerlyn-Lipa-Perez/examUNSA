import { Module } from '@nestjs/common';
import { SimulacrosService } from './simulacros.service';
import { SimulacrosController } from './simulacros.controller';
import { AiModule } from '../ai/ai.module';
import { RankingModule } from '../ranking/ranking.module';

@Module({
  imports: [AiModule, RankingModule],
  controllers: [SimulacrosController],
  providers: [SimulacrosService],
})
export class SimulacrosModule {}