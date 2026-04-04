import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Prefijo global para todos los endpoints (ej. /api/auth/login)
  app.setGlobalPrefix('api');

  // Habilitar validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos no definidos en el DTO
      transform: true, // Transforma los payloads a las instancias de las clases DTO
    }),
  );

  // Configurar CORS
  const frontendUrl = configService.get<string>('FRONTEND_URL');
  const allowedOrigins = frontendUrl 
    ? [frontendUrl, 'http://localhost:3000']
    : ['http://localhost:3000'];
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`Aplicación corriendo en: http://localhost:${port}/api`);
}
bootstrap();
