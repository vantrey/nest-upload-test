import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';

export const getSetupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Blogger with quiz game')
    .setDescription('The blogger API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [AppModule],
  });

  return SwaggerModule.setup('api', app, document);
};
