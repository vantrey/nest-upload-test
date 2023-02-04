import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/configuration';
import { createdApp } from './helpers/createdApp';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { getSetupSwagger } from './swagger/getSetupSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService<ConfigType>);
  const port = configService.get('PORT', { infer: true });
  const finishedApp = createdApp(app);
  getSetupSwagger(finishedApp);
  app.enableCors();
  await finishedApp.listen(port).then(async () => console.log(`Server is listening on ${await app.getUrl()}`));
  // get the swagger json file (if app is running in development mode)
  const dev = configService.get('dev', { infer: true });
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
