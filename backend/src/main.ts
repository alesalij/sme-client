import { NestFactory, NestApplication } from "@nestjs/core";
import { ValidationPipe, Logger as NestLogger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { redirectMiddleware } from "./common/redirect.middleware";
import { LoggerService } from "./common/logger.service";

async function bootstrap() {
 // Создаем приложение без логгера
 const app = await NestFactory.create(AppModule, {
 bufferLogs: true,
 });

 // Получаем наш кастомный логгер
 const logger = app.get(LoggerService);
  
 // Используем наш логгер для NestJS
 app.useLogger(logger);

 // Enable CORS
 app.enableCors({
 origin: process.env.CORS_ORIGIN || "http://localhost:5173",
 credentials: true,
 });

 // Global prefix
 app.setGlobalPrefix("api");

 // Redirect root to swagger
 app.use(redirectMiddleware);

 // Validation
 app.useGlobalPipes(
 new ValidationPipe({
 whitelist: true,
 forbidNonWhitelisted: true,
 transform: true,
 }),
 );

 // Swagger
 const config = new DocumentBuilder()
 .setTitle("SME Client API")
 .setVersion("1.0.0")
 .addBearerAuth()
 .build();
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup("docs", app, document);

 const port = process.env.PORT ||3001;
 await app.listen(port);
  
 logger.log(`Server running on http://0.0.0.0:${port}`, 'Bootstrap');
 logger.log(`Swagger: http://0.0.0.0:${port}/docs`, 'Bootstrap');
}
bootstrap();
