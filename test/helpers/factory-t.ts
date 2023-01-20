import { UsersViewType } from '../../src/modules/users/infrastructure/query-reposirory/user-View-Model';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { BlogViewModel } from '../../src/modules/blogs/infrastructure/query-repository/blog-View-Model';
import { CommentsViewType } from '../../src/modules/comments/infrastructure/query-repository/comments-View-Model';
import { PostViewModel } from '../../src/modules/posts/infrastructure/query-repositories/post-View-Model';
import { endpoints } from './routing';
import { CreateUserDto } from '../../src/modules/users/api/input-Dto/create-User-Dto-Model';
import { LoginDto } from '../../src/modules/auth/api/input-dtos/login-Dto-Model';
import { CreateBlogDto } from '../../src/modules/blogger/api/input-dtos/create-Blog-Dto-Model';
import { CreatePostDto } from '../../src/modules/posts/api/input-Dtos/create-Post-Dto-Model';
import { CreateCommentDto } from '../../src/modules/posts/api/input-Dtos/create-Comment-Dto-Model';
import { generateRandomString } from './generateRandomText';

export const superUser = {
  login: 'admin',
  password: 'qwerty',
};

export class FactoryT {
  async createUserByLoginEmail(count: number, app: INestApplication) {
    const result: {
      userId: string;
      user: UsersViewType;
      accessToken: string;
      refreshToken: string;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const userInputModel: CreateUserDto = {
        login: `asi-${i}`,
        password: `asirius-12${i}`,
        email: `asirius${i}@jive.com`,
      };
      const loginInputModel: LoginDto = {
        loginOrEmail: `asi-${i}`,
        password: `asirius-12${i}`,
      };
      const response00 = await request(app.getHttpServer())
        .post(endpoints.saController)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .send(userInputModel)
        .expect(201);

      const responseToken = await request(app.getHttpServer())
        .post(endpoints.authController.login)
        .set(`User-Agent`, `for test`)
        .send(loginInputModel)
        .expect(200);
      result.push({
        userId: response00.body.id,
        user: response00.body,
        accessToken: responseToken.body.accessToken,
        refreshToken: responseToken.headers['set-cookie'],
      });
    }
    return result;
  }

  async createUniqueUserByLoginEmail(count: number, uniq: string, app: INestApplication) {
    const result: {
      userId: string;
      user: UsersViewType;
      accessToken: string;
      refreshToken: string;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const userInputModel: CreateUserDto = {
        login: `${uniq}-${i}`,
        password: `${uniq}${i}`,
        email: `${uniq}-${i}@jive.com`,
      };
      const loginInputModel: LoginDto = {
        loginOrEmail: `${uniq}-${i}`,
        password: `${uniq}${i}`,
      };
      const response00 = await request(app.getHttpServer())
        .post(endpoints.saController)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .send(userInputModel)
        .expect(201);

      const responseToken = await request(app.getHttpServer())
        .post(endpoints.authController.login)
        .set(`User-Agent`, `for test`)
        .send(loginInputModel)
        .expect(200);
      result.push({
        userId: response00.body.id,
        user: response00.body,
        accessToken: responseToken.body.accessToken,
        refreshToken: responseToken.headers['set-cookie'],
      });
    }
    return result;
  }

  async createUniqueUserByLoginAndEmail(count: number, log: string, mal: string, app: INestApplication) {
    const result: {
      userId: string;
      user: UsersViewType;
      accessToken: string;
      refreshToken: string;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const userInputModel: CreateUserDto = {
        login: `${log}`,
        password: `${log}${i}`,
        email: `${mal}`,
      };
      const loginInputModel: LoginDto = {
        loginOrEmail: `${log}`,
        password: `${log}${i}`,
      };
      const response00 = await request(app.getHttpServer())
        .post(endpoints.saController)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .send(userInputModel)
        .expect(201);

      const responseToken = await request(app.getHttpServer())
        .post(endpoints.authController.login)
        .set(`User-Agent`, `for test`)
        .send(loginInputModel)
        .expect(200);
      result.push({
        userId: response00.body.id,
        user: response00.body,
        accessToken: responseToken.body.accessToken,
        refreshToken: responseToken.headers['set-cookie'],
      });
    }
    return result;
  }

  async createBlog(count: number, accessToken: string, app: INestApplication) {
    const result: { blog: BlogViewModel }[] = [];
    for (let i = 0; i < count; i++) {
      const postInputModel: CreateBlogDto = {
        name: `Mongoose${i}${i}`,
        description: `A mongoose is a small terrestrial carnivorous mammal belonging to the family Herpestidae`,
        websiteUrl: `https://www.mongoose${i}${i}.com`,
      };
      const responseBlog = await request(app.getHttpServer())
        .post(endpoints.bloggerController)
        .auth(accessToken, { type: 'bearer' })
        .send(postInputModel)
        .expect(201);
      result.push({ blog: responseBlog.body });
    }
    return result;
  }

  async createUniqueBlog(count: number, uniq: string, accessToken: string, app: INestApplication) {
    const result: { blog: BlogViewModel }[] = [];
    for (let i = 0; i < count; i++) {
      const postInputModel: CreateBlogDto = {
        name: `${uniq}${i}${i}`,
        description: `A mongoose is a small terrestrial carnivorous mammal belonging to the family Herpestidae`,
        websiteUrl: `https://www.mongoose${i}${i}.com`,
      };
      const responseBlog = await request(app.getHttpServer())
        .post(endpoints.bloggerController)
        .auth(accessToken, { type: 'bearer' })
        .send(postInputModel)
        .expect(201);
      result.push({ blog: responseBlog.body });
    }
    return result;
  }

  async createPost(count: number, accessToken: string, blogId: string, app: INestApplication) {
    const result: { post: PostViewModel }[] = [];
    for (let i = 0; i < count; i++) {
      const postInputModel: CreateBlogDto = {
        name: `Mongoose${i}${i}`,
        description: `A mongoose is a small terrestrial carnivorous mammal belonging to the family Herpestidae`,
        websiteUrl: `https://www.mongoose${i}${i}.com`,
      };
      const responsePost = await request(app.getHttpServer())
        .post(endpoints.bloggerController + `/${blogId}/posts`)
        .auth(accessToken, { type: 'bearer' })
        .send(postInputModel)
        .expect(201);
      result.push({ post: responsePost.body });
    }
    return result;
  }

  async createUniquePost(count: number, uniq: string, accessToken: string, blogId: string, app: INestApplication) {
    const result: { post: PostViewModel }[] = [];
    for (let i = 0; i < count; i++) {
      const postInputModel: CreatePostDto = {
        title: `${uniq}${i}`,
        shortDescription: `A mongoose is a small terrestrial carnivorous mammal belonging to the family Herpestidae`,
        content: `mongoose${i}${i}.com Let's not forget that SQL is a very high level language and very dynamic, so we can express in our plain js object only basic queries. Suggested syntax is weird IMO and covers such case, that can be easily extended to hundred other cases that aren't covered by this syntax.`,
      };
      const responsePost = await request(app.getHttpServer())
        .post(endpoints.bloggerController + `/${blogId}/posts`)
        .auth(accessToken, { type: 'bearer' })
        .send(postInputModel)
        .expect(201);
      result.push({ post: responsePost.body });
    }
    return result;
  }

  async createComment(count: number, accessToken: string, id: string, app: INestApplication) {
    const result: { comment: CommentsViewType }[] = [];
    for (let i = 0; i < count; i++) {
      const commentInputModel: CreateCommentDto = {
        content: `This is a new comment for post 0${i}`,
      };
      const response = await request(app.getHttpServer())
        .post(endpoints.postController + `/${id}/comments`)
        // .post(`/posts/${id}/comments`)
        .auth(accessToken, { type: 'bearer' })
        .send(commentInputModel)
        .expect(201);
      result.push({ comment: response.body });
    }
    return result;
  }

  async createUniqueComment(count: number, length: number, accessToken: string, postId: string, app: INestApplication) {
    const result: { comment: CommentsViewType }[] = [];
    for (let i = 0; i < count; i++) {
      const commentInputModel: CreateCommentDto = {
        content: `${generateRandomString(length)}${i}`,
      };
      const response = await request(app.getHttpServer())
        .post(endpoints.postController + `/${postId}/comments`)
        .auth(accessToken, { type: 'bearer' })
        .send(commentInputModel)
        .expect(201);
      result.push({ comment: response.body });
    }
    return result;
  }

  async createBlogsAndPostForTest(count: number, accessToken: string, app: INestApplication) {
    const result: { blog: BlogViewModel; post: PostViewModel }[] = [];
    for (let i = 0; i < count; i++) {
      const postInputModel: CreatePostDto = {
        title: 'string title',
        shortDescription: 'string shortDescription',
        content: 'string content',
      };
      const responseBlog = await request(app.getHttpServer())
        .post(endpoints.bloggerController)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: `Raccoon-${i}${i}`,
          description: `A Raccoon is a small terrestrial carnivorous mammal belonging to the family Herpestidae`,
          websiteUrl: `https://www.Raccoon${i}${i}.com`,
        })
        .expect(201);
      const responsePost = await request(app.getHttpServer())
        .post(endpoints.bloggerController + `/${responseBlog.body.id}/posts`)
        .auth(accessToken, { type: 'bearer' })
        .send(postInputModel)
        .expect(201);
      result.push({ blog: responseBlog.body, post: responsePost.body });
    }
    return result;
  }

  async createLikePost(id: string, value: string, accessToken: string, app: INestApplication) {
    const inputModel = {
      likeStatus: `${value}`,
    };
    await request(app.getHttpServer())
      .put(endpoints.postController + `/${id}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: `${value}` })
      .expect(204);
  }

  async createLikeComment(id: string, value: string, accessToken: string, app: INestApplication) {
    await request(app.getHttpServer())
      .put(endpoints.commentController + `/${id}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: `${value}` })
      .expect(204);
  }
}
