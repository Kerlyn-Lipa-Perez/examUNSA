import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
  ) {}

  async findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }

  async findById(id: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
  }

  async create(data: { email: string; passwordHash: string; nombre: string }) {
    const [nuevoUsuario] = await this.db
      .insert(schema.users)
      .values(data)
      .returning();
    return nuevoUsuario;
  }

  async updatePlan(userId: string, plan: 'free' | 'pro') {
    const [updatedUser] = await this.db
      .update(schema.users)
      .set({ plan })
      .where(eq(schema.users.id, userId))
      .returning();
    return updatedUser;
  }

  async resetSimulacrosHoy() {
    return this.db.update(schema.users).set({ simulacrosHoy: 0 });
  }
}