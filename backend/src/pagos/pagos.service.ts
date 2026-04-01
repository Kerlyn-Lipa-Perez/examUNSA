import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc } from 'drizzle-orm';
import { createHmac } from 'crypto';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

// Precio del plan Pro en céntimos (S/ 29.90)
const PLAN_PRO_AMOUNT = 2990;

@Injectable()
export class PagosService {
  private readonly logger = new Logger(PagosService.name);

  constructor(
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
  ) {}

  // ─── Checkout: datos que el frontend necesita para abrir CulqiCheckout ───
  async crearCheckout(userId: string, _planId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    return {
      publicKey: process.env.CULQI_PUBLIC_KEY,
      amount: PLAN_PRO_AMOUNT,
      currency: 'PEN',
      email: user.email,
    };
  }

  // ─── Confirmar pago: recibe token del frontend y crea cargo real en Culqi ───
  async confirmarPago(userId: string, tokenId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.plan === 'pro') throw new BadRequestException('Ya tienes el plan Pro activo');

    // Crear cargo en Culqi
    const cargo = await this.crearCargo({
      amount: PLAN_PRO_AMOUNT,
      currencyCode: 'PEN',
      email: user.email,
      sourceId: tokenId,
    });

    // Actualizar plan del usuario a Pro
    await this.db
      .update(schema.users)
      .set({ plan: 'pro' })
      .where(eq(schema.users.id, userId));

    // Registrar el pago en la tabla pagos
    await this.db.insert(schema.pagos).values({
      userId: userId,
      monto: cargo.amount,
      moneda: cargo.currency_code,
      estado: 'completado',
      planId: 'pro',
      referencia: cargo.id,
    });

    this.logger.log(`Plan actualizado a PRO para usuario ${userId} — cargo ${cargo.id}`);

    return {
      success: true,
      message: 'Pago procesado correctamente. ¡Bienvenido a Pro!',
      cargoId: cargo.id,
    };
  }

  // ─── Crear cargo en la API de Culqi ───
  private async crearCargo(params: {
    amount: number;
    currencyCode: string;
    email: string;
    sourceId: string;
  }) {
    const secretKey = process.env.CULQI_SECRET_KEY;

    if (!secretKey) {
      this.logger.error('CULQI_SECRET_KEY no configurada');
      throw new BadRequestException('Error de configuración de pagos');
    }

    const response = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amount,
        currency_code: params.currencyCode,
        email: params.email,
        source_id: params.sourceId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const culqiError = data as {
        merchant_message?: string;
        user_message?: string;
        type?: string;
      };
      this.logger.error(`Error de Culqi: ${culqiError.merchant_message || JSON.stringify(data)}`);
      throw new BadRequestException(
        culqiError.user_message || 'No se pudo procesar el pago. Intenta de nuevo.',
      );
    }

    return data as {
      id: string;
      amount: number;
      currency_code: string;
      email: string;
      state: string;
    };
  }

  // ─── Webhook de Culqi: validar firma HMAC y procesar evento ───
  async procesarWebhook(payload: any, signature: string | undefined) {
    const secretKey = process.env.CULQI_SECRET_KEY;

    if (!secretKey) {
      this.logger.error('CULQI_SECRET_KEY no configurada para webhook');
      return { received: false };
    }

    if (!signature) {
      this.logger.warn('Webhook de Culqi sin header x-culqi-signature');
      return { received: false };
    }

    const bodyString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const expectedSignature = createHmac('sha256', secretKey)
      .update(bodyString)
      .digest('hex');

    if (signature !== expectedSignature) {
      this.logger.warn('Firma HMAC de webhook de Culqi inválida');
      return { received: false };
    }

    // Procesar evento de cargo exitoso
    if (payload.object === 'charge' && payload.status === 'succeeded') {
      const email = payload.email as string;

      const user = await this.db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });

      if (user) {
        // Evitar duplicados por referencia
        const existingPago = await this.db.query.pagos.findFirst({
          where: eq(schema.pagos.referencia, payload.id),
        });

        if (existingPago) {
          this.logger.log(`Webhook duplicado ignorado: ${payload.id}`);
          return { received: true };
        }

        await this.db
          .update(schema.users)
          .set({ plan: 'pro' })
          .where(eq(schema.users.id, user.id));

        await this.db.insert(schema.pagos).values({
          userId: user.id,
          monto: payload.amount || PLAN_PRO_AMOUNT,
          moneda: payload.currency || 'PEN',
          estado: 'completado',
          planId: 'pro',
          referencia: payload.id,
        });

        this.logger.log(`[Webhook] Plan actualizado a PRO para ${email}`);
      }
    }

    return { received: true };
  }

  // ─── Historial de pagos ───
  async getHistorial(userId: string) {
    const pagos = await this.db.query.pagos.findMany({
      where: eq(schema.pagos.userId, userId),
      orderBy: [desc(schema.pagos.createdAt)],
    });

    return pagos.map((p) => ({
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
