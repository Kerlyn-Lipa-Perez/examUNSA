import { Module } from '@nestjs/common';
import { SimulacrosService } from './simulacros.service';
import { SimulacrosController } from './simulacros.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [SimulacrosController],
  providers: [SimulacrosService],
})
export class SimulacrosModule {}