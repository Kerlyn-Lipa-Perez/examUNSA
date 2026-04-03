import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let emailService: jest.Mocked<EmailService>;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    nombre: 'Juan Pérez',
    passwordHash: 'hashed_password',
    plan: 'free' as const,
    simulacrosHoy: 0,
    streakDias: 0,
    ultimoAcceso: null,
    googleId: null,
    avatarUrl: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    preferencias: null,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findByGoogleId: jest.fn(),
            create: jest.fn(),
            linkGoogleAccount: jest.fn(),
            setPasswordResetToken: jest.fn(),
            findByResetToken: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-google-client-id'),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    emailService = module.get(EmailService);
  });

  // ======= REGISTRO =======
  describe('register', () => {
    it('debe registrar un usuario y retornar token + user', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'test@example.com',
        password: 'Password123!',
        nombre: 'Juan Pérez',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(usersService.create).toHaveBeenCalledWith({
        nombre: 'Juan Pérez',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        plan: mockUser.plan,
      });
      expect(result).toEqual({
        token: 'mock-jwt-token',
        access_token: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          nombre: mockUser.nombre,
          email: mockUser.email,
          plan: mockUser.plan,
        },
      });
    });

    it('debe lanzar BadRequestException si el email ya existe', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'Password123!',
          nombre: 'Juan Pérez',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  // ======= LOGIN =======
  describe('login', () => {
    it('debe retornar token cuando las credenciales son correctas', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result).toEqual({
        token: 'mock-jwt-token',
        access_token: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          nombre: mockUser.nombre,
          email: mockUser.email,
          plan: mockUser.plan,
        },
      });
    });

    it('debe lanzar UnauthorizedException si el email no existe', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'noexiste@example.com', password: '123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ======= GET ME =======
  describe('getMe', () => {
    it('debe retornar usuario sin passwordHash', async () => {
      usersService.findById.mockResolvedValue(mockUser);

      const result = await service.getMe('user-uuid-123');

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).toHaveProperty('email', mockUser.email);
    });

    it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(service.getMe('no-existe')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ======= FORGOT PASSWORD =======
  describe('forgotPassword', () => {
    it('debe enviar email de recuperación si el usuario existe', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.forgotPassword('test@example.com');

      expect(usersService.setPasswordResetToken).toHaveBeenCalled();
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.nombre,
        expect.any(String), // token generado por crypto
      );
      expect(result.message).toContain('enlace de recuperación');
    });

    it('debe retornar mensaje genérico si el email NO existe (sin revelar)', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.forgotPassword('noexiste@example.com');

      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(result.message).toContain('enlace de recuperación');
    });
  });

  // ======= CHANGE PASSWORD =======
  describe('changePassword', () => {
    it('debe cambiar la contraseña si la actual es correcta', async () => {
      usersService.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.changePassword(
        'user-uuid-123',
        'ViejaPass123!',
        'NuevaPass456!',
      );

      expect(usersService.resetPassword).toHaveBeenCalledWith(
        mockUser.id,
        'hashed_password',
      );
      expect(result.message).toContain('actualizada correctamente');
    });

    it('debe rechazar si la contraseña actual es incorrecta', async () => {
      usersService.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('user-uuid-123', 'wrong', 'NuevaPass456!'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
