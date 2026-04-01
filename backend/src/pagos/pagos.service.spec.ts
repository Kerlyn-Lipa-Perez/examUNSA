import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { DATABASE_CONNECTION } from '../database/database.provider';

// Mock de fetch global para llamadas a Culqi
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('PagosService', () => {
  let service: PagosService;
  let dbMock: any;

  const mockUserFree = {
    id: 'user-123',
    email: 'test@example.com',
    plan: 'free',
  };

  const mockUserPro = {
    id: 'user-456',
    email: 'pro@example.com',
    plan: 'pro',
  };

  beforeEach(async () => {
    // Guardar env vars originales
    process.env.CULQI_PUBLIC_KEY = 'pk_test_mock123';
    process.env.CULQI_SECRET_KEY = 'sk_test_mock456';

    dbMock = {
      query: {
        users: { findFirst: jest.fn() },
        pagos: {
          findMany: jest.fn().mockResolvedValue([]),
          findFirst: jest.fn(),
        },
      },
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(undefined),
    };

    mockFetch.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        { provide: DATABASE_CONNECTION, useValue: dbMock },
      ],
    }).compile();

    service = module.get(PagosService);
  });

  // ======= CREAR CHECKOUT =======
  describe('crearCheckout', () => {
    it('debe retornar publicKey, amount, currency y email', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUserFree);

      const result = await service.crearCheckout('user-123', 'pro');

      expect(result).toEqual({
        publicKey: 'pk_test_mock123',
        amount: 2990,
        currency: 'PEN',
        email: 'test@example.com',
      });
    });

    it('debe lanzar BadRequestException si el usuario no existe', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(null);

      await expect(service.crearCheckout('no-existe', 'pro')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ======= CONFIRMAR PAGO =======
  describe('confirmarPago', () => {
    it('debe crear cargo, actualizar plan y registrar pago', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUserFree);

      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'chr_culqi_123',
            amount: 2990,
            currency_code: 'PEN',
            email: 'test@example.com',
            state: 'succeeded',
          }),
      });

      const result = await service.confirmarPago('user-123', 'tok_test_abc');

      // Verifica llamada a Culqi
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.culqi.com/v2/charges',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer sk_test_mock456',
          }),
        }),
      );

      // Verifica que actualiza plan a Pro
      expect(dbMock.update).toHaveBeenCalled();
      expect(dbMock.set).toHaveBeenCalledWith({ plan: 'pro' });

      // Verifica que registra el pago
      expect(dbMock.insert).toHaveBeenCalled();
      expect(dbMock.values).toHaveBeenCalledWith(
        expect.objectContaining({
          monto: 2990,
          moneda: 'PEN',
          estado: 'completado',
          planId: 'pro',
          referencia: 'chr_culqi_123',
        }),
      );

      expect(result.success).toBe(true);
    });

    it('debe rechazar si el usuario ya es Pro', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUserPro);

      await expect(
        service.confirmarPago('user-456', 'tok_test_abc'),
      ).rejects.toThrow('Ya tienes el plan Pro activo');
    });

    it('debe lanzar BadRequestException si Culqi rechaza el cargo', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUserFree);

      mockFetch.mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({
            user_message: 'Tarjeta declinada',
            merchant_message: 'Card declined',
          }),
      });

      await expect(
        service.confirmarPago('user-123', 'tok_invalid'),
      ).rejects.toThrow('Tarjeta declinada');
    });

    it('debe lanzar error si CULQI_SECRET_KEY no está configurada', async () => {
      delete process.env.CULQI_SECRET_KEY;
      dbMock.query.users.findFirst.mockResolvedValue(mockUserFree);

      await expect(
        service.confirmarPago('user-123', 'tok_test'),
      ).rejects.toThrow('Error de configuración de pagos');

      // Restaurar
      process.env.CULQI_SECRET_KEY = 'sk_test_mock456';
    });
  });

  // ======= PROCESAR WEBHOOK =======
  describe('procesarWebhook', () => {
    it('debe procesar webhook válido con firma HMAC correcta', async () => {
      const { createHmac } = require('crypto');
      const secretKey = process.env.CULQI_SECRET_KEY!;
      const payload = {
        id: 'charge_123',
        object: 'charge',
        status: 'succeeded',
        email: 'test@example.com',
        amount: 2990,
        currency: 'PEN',
      };
      const bodyString = JSON.stringify(payload);
      const signature = createHmac('sha256', secretKey).update(bodyString).digest('hex');

      dbMock.query.users.findFirst.mockResolvedValue(mockUserFree);
      dbMock.query.pagos.findFirst.mockResolvedValue(null); // No duplicado

      const result = await service.procesarWebhook(payload, signature);

      expect(result).toEqual({ received: true });
      expect(dbMock.update).toHaveBeenCalled();
      expect(dbMock.set).toHaveBeenCalledWith({ plan: 'pro' });
    });

    it('debe rechazar webhook con firma inválida', async () => {
      const payload = { object: 'charge', status: 'succeeded' };

      const result = await service.procesarWebhook(payload, 'firma_invalida');

      expect(result).toEqual({ received: false });
    });

    it('debe rechazar webhook sin firma', async () => {
      const result = await service.procesarWebhook({}, undefined);

      expect(result).toEqual({ received: false });
    });

    it('debe ignorar webhooks duplicados', async () => {
      const { createHmac } = require('crypto');
      const secretKey = process.env.CULQI_SECRET_KEY!;
      const payload = {
        id: 'charge_dup',
        object: 'charge',
        status: 'succeeded',
        email: 'test@example.com',
      };
      const bodyString = JSON.stringify(payload);
      const signature = createHmac('sha256', secretKey).update(bodyString).digest('hex');

      dbMock.query.users.findFirst.mockResolvedValue(mockUserFree);
      dbMock.query.pagos.findFirst.mockResolvedValue({ id: 'existing' }); // Ya existe

      const result = await service.procesarWebhook(payload, signature);

      expect(result).toEqual({ received: true });
      // NO debe insertar ni actualizar
      expect(dbMock.insert).not.toHaveBeenCalled();
    });
  });

  // ======= GET HISTORIAL =======
  describe('getHistorial', () => {
    it('debe retornar historial de pagos del usuario', async () => {
      const mockPagos = [
        { id: 'p1', monto: 2990, moneda: 'PEN', estado: 'completado', planId: 'pro', referencia: 'chr_1', createdAt: new Date() },
      ];
      dbMock.query.pagos.findMany.mockResolvedValue(mockPagos);

      const result = await service.getHistorial('user-123');

      expect(result).toHaveLength(1);
      expect(result[0].monto).toBe(2990);
      expect(result[0].estado).toBe('completado');
    });

    it('debe retornar array vacío si no hay pagos', async () => {
      dbMock.query.pagos.findMany.mockResolvedValue([]);

      const result = await service.getHistorial('user-123');

      expect(result).toEqual([]);
    });
  });
});
