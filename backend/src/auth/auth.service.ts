import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
}