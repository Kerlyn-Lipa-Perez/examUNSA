import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AiModule } from './ai/ai.module';
import { SimulacrosModule } from './simulacros/simulacros.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { PagosModule } from './pagos/pagos.module';
import { EmailModule } from './email/email.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),

    // Módulo de Base de Datos (Drizzle + PG)
    DatabaseModule,

    // Rate Limiting (10 requests por minuto por IP por defecto)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),

    // Para tareas programadas (Cron jobs)
    ScheduleModule.forRoot(),

    // Módulos de la aplicación
    UsersModule,
    AuthModule,
    AiModule,
    SimulacrosModule,
    FlashcardsModule,
    PagosModule,
    EmailModule,
    SchedulerModule,
  ],
})
export class AppModule {}