import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/configuration';
import { createdApp } from './helpers/createdApp';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createWriteStream } from 'fs';
import { get } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true },
  });
  const configService = app.get(ConfigService<ConfigType>);
  const port = configService.get('PORT', { infer: true });
  const dev = configService.get('dev', { infer: true });
  const finishedApp = createdApp(app);

  // const getInstagramSetupSwagger = (app: INestApplication) => {
  //   const instagramOptions = new DocumentBuilder().setTitle('Blogger with quiz game').setVersion('1.0').build();
  //
  //   const instagramDocument = SwaggerModule.createDocument(app, instagramOptions, {
  //     include: [UsersController],
  //   });
  //
  //   return SwaggerModule.setup('api/sa', app, instagramDocument);
  // };
  //
  // getInstagramSetupSwagger(finishedApp);
  const config = new DocumentBuilder()
    .setTitle('Blogger with quiz game')
    .setDescription('The blogger API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth()
    .addBasicAuth()
    .addTag('bloggers')
    .build();
  //
  // const config_sa = new DocumentBuilder()
  //   .setTitle('Blogger with quiz game')
  //   .setDescription('The blogger API description')
  //   .setVersion('1.0')
  //   .addBasicAuth()
  //   .addTag('sa')
  //   .build();

  const document = SwaggerModule.createDocument(finishedApp, config);
  // const document_sa = SwaggerModule.createDocument(finishedApp, config_sa);
  SwaggerModule.setup('api', finishedApp, document);
  // SwaggerModule.setup('api/sa', finishedApp, document_sa);

  await finishedApp.listen(port).then(async () => console.log(`Server is listening on ${await app.getUrl()}`));

  // get the swagger json file (if app is running in development mode)
  if (dev.NODE_ENV === 'development') {
    const serverUrl = `http://localhost:${port}`;
    // write swagger ui files
    get(`${serverUrl}/api/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      // console.log(`Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`);
    });

    get(`${serverUrl}/api/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      // console.log(`Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`);
    });

    get(`${serverUrl}/api/swagger-ui-standalone-preset.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-standalone-preset.js'));
      // console.log(`Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`);
    });

    get(`${serverUrl}/api/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      // console.log(`Swagger UI css file written to: '/swagger-static/swagger-ui.css'`);
    });
  }
}

bootstrap();

/*export const getInstagramSetupSwagger = (app: INestApplication) => {
    const instagramOptions = new DocumentBuilder()
        .setTitle('Instagram API Docs')
        .setVersion('1.0')
        .build();

    const instagramDocument = SwaggerModule.createDocument(app, instagramOptions, {
        include: [InstagramModule],
    });

    return SwaggerModule.setup('api/instagram', app, instagramDocument);
}*/
