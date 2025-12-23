import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { log } from './common/helpers/winston.logger';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({ instance: log }),
        cors: true,
    });
    const options = new DocumentBuilder()
        .setTitle('Soft-skills-school-API')
        .setDescription('Api for soft skill school')
        .setVersion('3.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: { defaultModelsExpandDepth: -1 },
    });

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(process.env.PORT);
}
bootstrap();
