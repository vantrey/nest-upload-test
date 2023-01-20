import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { createdApp } from '../src/helpers/createdApp';
import { BlogViewModel } from '../src/modules/blogs/infrastructure/query-repository/blog-View-Model';
import { PostViewModel } from '../src/modules/posts/infrastructure/query-repositories/post-View-Model';
import { endpoints } from './helpers/routing';
import { TestingFactory } from './helpers/testing-factory';

jest.setTimeout(1200000);

describe(`Factory `, () => {
  let app: INestApplication;
  beforeAll(async () => {
    // Create a NestJS application
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    //created me
    app = createdApp(app);
    // Connect to the in-memory server
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  describe(`factory users - blogs - posts `, () => {
    let accessToken: string;
    let accessToken1: string;
    let accessToken2: string;
    let accessToken3: string;
    let blog: BlogViewModel;
    let post: PostViewModel;
    it(`00 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`01 - test endpoint`, async () => {
      //TODO create for test
      /* await TestingFactory.prototype.createUniqueUserByLoginAndEmail(
        1,
        'user01',
        'email1@gg.cm',
        app,
      );
      await TestingFactory.prototype.createUniqueUserByLoginAndEmail(
        1,
        'user02',
        'email1@gg.com',
        app,
      );
      await TestingFactory.prototype.createUniqueUserByLoginAndEmail(
        1,
        'user05',
        'email1@gg.coi',
        app,
      );
      await TestingFactory.prototype.createUniqueUserByLoginAndEmail(
        1,
        'user03',
        'email1@gg.cou',
        app,
      );
      await TestingFactory.prototype.createUniqueUserByLoginAndEmail(
        1,
        'useee01',
        'email1@gg.col',
        app,
      );
      await TestingFactory.prototype.createUniqueUserByLoginAndEmail(
        1,
        'log01',
        'emai@gg.com',
        app,
      );
      await TestingFactory.prototype.createUniqueUserByLoginAndEmail(
        1,
        'log02',
        'email2@gg.com',
        app,
      );
      await TestingFactory.prototype.createUniqueUserByLoginAndEmail(
        1,
        'user15',
        'emarrr1@gg.com',
        app,
      );
      await TestingFactory.prototype.createUniqueUserByLoginAndEmail(
        1,
        'usr-1-01',
        'email3@gg.com',
        app,
      );
      await TestingFactory.prototype.createUniqueUserByLoginAndEmail(
        1,
        'some01',
        'email1@gyyyg.ru',
        app,
      );
      await TestingFactory.prototype.createUniqueUserByLoginAndEmail(
        1,
        'use4406',
        'email1@grrg.ro',
        app,
      );*/
      const r = await TestingFactory.prototype.createUserByLoginEmail(1, app);
      accessToken = r[0].accessToken;
      // accessToken1 = r[1].accessToken;
      // accessToken2 = r[2].accessToken;
      // accessToken3 = r[3].accessToken;
      // await TestingFactory.prototype.createUniqueUserByLoginEmail(1, 'asirius', app);
      const b = await TestingFactory.prototype.createUniqueBlog(1, 'aRamat', accessToken, app);
      blog = b[0].blog;
      const p = await TestingFactory.prototype.createUniquePost(1, 'librus', accessToken, blog.id, app);
      post = p[0].post;
      // await TestingFactory.prototype.createUniqueComment(1, 40, accessToken, post.id, app);
      // await TestingFactory.prototype.createUniqueComment(1, 80, accessToken1, post.id, app);
      // await TestingFactory.prototype.createUniqueComment(1, 100, accessToken2, post.id, app);
      // await TestingFactory.prototype.createUniqueComment(1, 240, accessToken3, post.id, app);
      await TestingFactory.prototype.createLikePost(post.id, 'Like', accessToken, app);
    });
  });
});
