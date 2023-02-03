import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';

export const getSetupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Blogger with quiz game')
    .addServer('https://nest-with-type-orm.vercel.app')
    .setTermsOfService('http://localhost:5003/api-json')
    .setDescription('The blogger API description')
    .setVersion('h25.blogger')
    .addBearerAuth()
    // .addCookieAuth('refreshToken')
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [AppModule],
  });

  return SwaggerModule.setup('api', app, document);
};
