import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LoggerService } from '../helpers/winston.logger';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private logger: LoggerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException('Authorization token is missing');
      }

      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = payload;
    } catch (error) {
      this.logger.info('Authentication error:', error.message);
      throw new UnauthorizedException('Authentication failed');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const { authorization } = request.headers;

    if (!authorization) {
      return undefined;
    }

    const [type, token] = authorization.trim().split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
