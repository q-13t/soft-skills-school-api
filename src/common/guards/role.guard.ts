import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { LoggerService } from '../helpers/winston.logger';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private logger: LoggerService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;

      const token = authorization.trim().split(' ')[1];

      if (!token) {
        return false;
      }

      const decodedToken = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const { role } = decodedToken;

      return this.matchRoles(requiredRoles, role);
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  matchRoles(roles: Role[], userRole: Role) {
    return roles.some((role) => role === userRole);
  }
}
