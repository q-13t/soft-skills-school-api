import {
  Injectable,
  ExecutionContext,
  CanActivate,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { IpService } from 'src/modules/ip/ip.service';

@Injectable()
export class CustomThrottlerGuard implements CanActivate {
  private count = 0;
  constructor(private readonly ipService: IpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip;

    const blockedIp = await this.ipService.isBlocked(ip);
    if (blockedIp) {
      throw new HttpException(
        'Access denied: Too many requests from this IP address',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.count++;

    await this.ipService.blockIp(ip);

    return true;
  }
}
