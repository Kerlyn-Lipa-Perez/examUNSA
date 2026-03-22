import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class PagosService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    private configService: ConfigService,
  ) {}

  async crearCheckout(userId: string, planId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    // Aquí iría la integración con la API de Culqi para generar un cargo/orden.
    // Como esto depende del frontend para el token/checkout,
    // devolveremos un mock de URL de checkout para el MVP o los datos necesarios.
    return {
      checkoutUrl: `https://checkout.culqi.com/mock?user=${userId}&plan=${planId}`,
      publicKey: this.configService.get('CULQI_PUBLIC_KEY'),
      amount: 2500, // S/. 25.00 (en céntimos)
      currency: 'PEN',
      email: user.email,
    };
  }

  async procesarWebhook(payload: any) {
    // Aquí validamos la firma del webhook de Culqi usando CULQI_SECRET_KEY
    // Para simplificar, asumimos que recibimos un evento de cargo exitoso:
    
    if (payload.object === 'charge' && payload.status === 'succeeded') {
      const email = payload.email; // El email del usuario que pagó
      
      const user = await this.db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });

      if (user) {
        await this.db
          .update(schema.users)
          .set({ plan: 'pro' })
          .where(eq(schema.users.id, user.id));
        
        console.log(`Plan actualizado a PRO para ${email}`);
      }
    }

    return { received: true };
  }
}