import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc } from 'drizzle-orm';
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
        // Actualizar plan a Pro
        await this.db
          .update(schema.users)
          .set({ plan: 'pro' })
          .where(eq(schema.users.id, user.id));
        
        // Registrar el pago en la tabla pagos
        const montoCentavos = payload.amount || 2990; // Valor por defecto si no viene
        
        await this.db.insert(schema.pagos).values({
          userId: user.id,
          monto: montoCentavos,
          moneda: payload.currency || 'PEN',
          estado: 'completado',
          planId: 'pro',
          referencia: payload.id || `mock_${Date.now()}`,
        });
        
        console.log(`Plan actualizado a PRO para ${email}`);
      }
    }

    return { received: true };
  }

  async getHistorial(userId: string) {
    const pagos = await this.db.query.pagos.findMany({
      where: eq(schema.pagos.userId, userId),
      orderBy: [desc(schema.pagos.createdAt)],
    });

    return pagos.map(p => ({
      id: p.id,
      monto: p.monto,
      moneda: p.moneda,
      estado: p.estado,
      planId: p.planId,
      referencia: p.referencia,
      createdAt: p.createdAt,
    }));
  }
}