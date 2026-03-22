import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class PlanGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.plan === 'pro') {
      return true;
    }

    throw new ForbiddenException('Se requiere plan Pro para acceder a esta función');
  }
}