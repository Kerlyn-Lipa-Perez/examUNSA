import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.usersService.findByEmail(dto.email);
    if (userExists) {
      throw new BadRequestException('El email ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const newUser = await this.usersService.create({
      nombre: dto.nombre,
      email: dto.email,
      passwordHash,
    });

    const payload = { sub: newUser.id, email: newUser.email, plan: newUser.plan };
    const token = this.jwtService.sign(payload);

    return {
      token,
      access_token: token,
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        plan: newUser.plan,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, plan: user.plan };
    const token = this.jwtService.sign(payload);

    return {
      token,
      access_token: token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        plan: user.plan,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    
    // Devolvemos el usuario sin el hash de la contraseña
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // ======= PASSWORD RESET =======
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // No revelamos si el email existe o no por seguridad
      return { message: 'Si el email existe, recibirás un enlace de recuperación' };
    }

    // Generar token de recuperación
    const resetToken = randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token en la base de datos
    await this.usersService.setPasswordResetToken(user.id, resetToken, resetExpires);

    // Enviar email con el token
    await this.emailService.sendPasswordResetEmail(user.email, user.nombre, resetToken);

    return { message: 'Si el email existe, recibirás un enlace de recuperación' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Buscar usuario con este token
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    // Verificar que el token no haya expirado
    if (user.passwordResetExpires && new Date(user.passwordResetExpires) < new Date()) {
      throw new BadRequestException('El token ha expirado. Solicia uno nuevo.');
    }

    // Hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña y limpiar tokens
    await this.usersService.resetPassword(user.id, passwordHash);

    return { message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    await this.usersService.resetPassword(user.id, passwordHash);

    return { message: 'Contraseña actualizada correctamente' };
  }
}