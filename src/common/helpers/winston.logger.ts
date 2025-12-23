import { Injectable } from '@nestjs/common';
import { Logger, format, transports, createLogger } from 'winston';

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} ${level}: ${message}`;
});

const winstonConfig = {
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.json(),
    format.errors({ stack: true }),
    logFormat,
  ),
  level: 'debug',
  transports: [new transports.Console()],
};

@Injectable()
export class LoggerService {
  public readonly logger: Logger;

  constructor() {
    this.logger = createLogger(winstonConfig);
  }

  info(message: string, meta?: any) {
    this.logger.info(`${message} ${JSON.stringify(meta)}`);
  }

  error(message: string) {
    this.logger.error(message);
  }
}

export const log: Logger = new LoggerService().logger;
