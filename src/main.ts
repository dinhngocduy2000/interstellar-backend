import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import { loggerMiddleware } from "./middlewares/logger.js";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Apply cookie-parser middleware
  // Enable CORS
  app.enableCors({
    origin: ["http://localhost:3001"], // Allow only this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Add 'Content-Type' here
    credentials: true, // Allow cookies and auth headers
  });

  // Set global prefix
  app.setGlobalPrefix("/api/v1/");

  // Apply middlewares
  app.use(loggerMiddleware);
  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle("Interstellar API")
    .setDescription("Interstellar API Documentation")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
