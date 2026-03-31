import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly usersService: UsersService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetDailySimulacros() {
    this.logger.log('Reseteando contadores de simulacros diarios...');
    await this.usersService.resetSimulacrosHoy();
    this.logger.log('Contadores de simulacros diarios reseteados correctamente.');
  }
}
