import { Controller, Get, Post, Put, Delete, UseGuards, Request, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserPreferences } from '../database/schema';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me/profile')
  async getProfile(@Request() req: any) {
    return this.usersService.getUserProfile(req.user.userId);
  }

  @Get('me/stats')
  async getStats(@Request() req: any) {
    return this.usersService.getUserStats(req.user.userId);
  }

  // ======= PREFERENCIAS =======
  @Get('me/preferences')
  async getPreferences(@Request() req: any) {
    return this.usersService.getUserPreferences(req.user.userId);
  }

  @Put('me/preferences')
  async updatePreferences(@Request() req: any, @Body() prefs: Partial<UserPreferences>) {
    return this.usersService.updateUserPreferences(req.user.userId, prefs);
  }

  // ======= PERFIL =======
  @Put('me/profile')
  async updateProfile(@Request() req: any, @Body() data: { nombre?: string; email?: string }) {
    return this.usersService.updateProfile(req.user.userId, data);
  }

  // ======= ELIMINAR CUENTA =======
  @Delete('me/account')
  async deleteAccount(@Request() req: any) {
    return this.usersService.deleteAccount(req.user.userId);
  }
}