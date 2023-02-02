import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/configuration';
import { createdApp } from './helpers/createdApp';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true },
  });
  const configService = app.get(ConfigService<ConfigType>);
  const port = configService.get('PORT', { infer: true });
  const finishedApp = createdApp(app);
  const config = new DocumentBuilder()
    .setTitle('Blogger example')
    .setDescription('The blogger API description')
    .setVersion('1.0')
    .addTag('bloggers')
    .build();
  const document = SwaggerModule.createDocument(finishedApp, config);
  SwaggerModule.setup('api', finishedApp, document);

  await finishedApp.listen(port).then(async () => console.log(`Server is listening on ${await app.getUrl()}`));
}

bootstrap();
