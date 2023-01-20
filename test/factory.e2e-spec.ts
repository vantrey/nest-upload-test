import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { createdApp } from '../src/helpers/createdApp';
import { BlogViewModel } from '../src/modules/blogs/infrastructure/query-repository/blog-View-Model';
import { PostViewModel } from '../src/modules/posts/infrastructure/query-repositories/post-View-Model';
import { endpoints } from './helpers/routing';
import { FactoryT } from './helpers/factory-t';
import { CommentsViewType } from '../src/modules/comments/infrastructure/query-repository/comments-View-Model';

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
    let accessToken4: string;
    let accessToken5: string;
    let blog: BlogViewModel;
    let post: PostViewModel;
    let post1: PostViewModel;
    let comment: CommentsViewType;
    let comment1: CommentsViewType;
    it(`00 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`01 - test endpoint`, async () => {
      const r = await FactoryT.prototype.createUserByLoginEmail(6, app);
      accessToken = r[0].accessToken;
      console.log('----', accessToken);
      accessToken1 = r[1].accessToken;
      accessToken2 = r[2].accessToken;
      accessToken3 = r[3].accessToken;
      accessToken4 = r[4].accessToken;
      accessToken5 = r[5].accessToken;
      // await TestingFactory.prototype.createUniqueUserByLoginEmail(1, 'asirius', app);
      const b = await FactoryT.prototype.createUniqueBlog(1, 'aRamat', accessToken, app);
      blog = b[0].blog;
      const p = await FactoryT.prototype.createUniquePost(1, 'librus', accessToken, blog.id, app);
      post = p[0].post;
      const po = await FactoryT.prototype.createUniquePost(1, 'Makaka', accessToken, blog.id, app);
      post1 = po[0].post;
      const c = await FactoryT.prototype.createUniqueComment(1, 40, accessToken, post.id, app);
      comment = c[0].comment;
      const co = await FactoryT.prototype.createUniqueComment(1, 100, accessToken2, post.id, app);
      comment1 = co[0].comment;
      await FactoryT.prototype.createUniqueComment(1, 80, accessToken1, post.id, app);
      await FactoryT.prototype.createUniqueComment(4, 240, accessToken3, post.id, app);

      await FactoryT.prototype.createLikePost(post.id, 'Like', accessToken, app);
      await FactoryT.prototype.createLikePost(post.id, 'Like', accessToken1, app);
      await FactoryT.prototype.createLikePost(post.id, 'Like', accessToken2, app);
      await FactoryT.prototype.createLikePost(post.id, 'Dislike', accessToken3, app);
      await FactoryT.prototype.createLikePost(post.id, 'Like', accessToken4, app);
      await FactoryT.prototype.createLikePost(post.id, 'Like', accessToken5, app);

      await FactoryT.prototype.createLikePost(post1.id, 'Dislike', accessToken3, app);
      await FactoryT.prototype.createLikePost(post1.id, 'Like', accessToken4, app);
      await FactoryT.prototype.createLikePost(post1.id, 'Like', accessToken5, app);

      await FactoryT.prototype.createLikeComment(comment.id, 'Like', accessToken, app);
      await FactoryT.prototype.createLikeComment(comment.id, 'Like', accessToken1, app);
      await FactoryT.prototype.createLikeComment(comment.id, 'Like', accessToken2, app);
      await FactoryT.prototype.createLikeComment(comment.id, 'Dislike', accessToken3, app);
      await FactoryT.prototype.createLikeComment(comment.id, 'Like', accessToken4, app);

      await FactoryT.prototype.createLikeComment(comment1.id, 'Dislike', accessToken, app);
      await FactoryT.prototype.createLikeComment(comment1.id, 'Like', accessToken1, app);
      await FactoryT.prototype.createLikeComment(comment1.id, 'Dislike', accessToken2, app);
      await FactoryT.prototype.createLikeComment(comment1.id, 'Dislike', accessToken3, app);
      await FactoryT.prototype.createLikeComment(comment1.id, 'Like', accessToken4, app);
    });
  });
});
