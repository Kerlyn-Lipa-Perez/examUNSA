import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';
import * as schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProvider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const pool = new Pool({
      host:     config.get('DATABASE_HOST'),
      port:     config.get<number>('DATABASE_PORT'),
      database: config.get('DATABASE_NAME'),
      user:     config.get('DATABASE_USER'),
      password: config.get('DATABASE_PASSWORD'),
    });
    // drizzle() recibe el pool y el schema para habilitar queries relacionales
    return drizzle(pool, { schema });
  },
};
