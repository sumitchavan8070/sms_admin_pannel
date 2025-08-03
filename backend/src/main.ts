import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // API prefix
  app.setGlobalPrefix("api")

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("School Management System API")
    .setDescription("API for School Management System")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  // SwaggerModule.setup("api/docs", app, document)
  SwaggerModule.setup('api/docs', app, document, {
  jsonDocumentUrl: 'api-json', // this is important
});

  const port = process.env.PORT || 8080
  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`)
}
bootstrap()
