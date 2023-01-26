import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { createdApp } from '../src/helpers/createdApp';
import { endpoints } from './helpers/routing';
import { FactoryT, superUser } from './helpers/factory-t';
import { FactoryQuiz } from './helpers/factory-quiz';
import { QuestionViewModel } from '../src/modules/sa/infrastructure/query-reposirory/question-View-Model';
import { UsersViewType } from '../src/modules/users/infrastructure/query-reposirory/user-View-Model';

jest.setTimeout(1200000);

describe(`Question `, () => {
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

  describe.skip(`factory questions`, () => {
    const quiz = new FactoryQuiz();
    let question: QuestionViewModel;
    it(`00 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`01 - POST -> "/sa/quiz/questions": should create new question; status 201; content: created question; used additional methods: GET => /sa/quiz/questions;`, async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Calypso', 'Matias', 'Colombo'], app);
      await request(app.getHttpServer())
        .get(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [
              {
                id: expect.any(String),
                body: 'What is my name?',
                correctAnswers: expect.any(Array),
                published: false,
                createdAt: expect.any(String),
                updatedAt: null,
              },
            ],
          });
        });
    });
    it.skip(`02 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it.skip(`03 - GET -> "/sa/quiz/questions": should return status 200; content: questions array with pagination; used additional methods: POST -> /sa/quiz/questions;`, async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Calypso', 'Matias', 'Colombo'], app);
      await quiz.createWithQuestion(1, 'ttt dddd  l', ['dddd', 'aaaaa', 'gggg'], app);
      const res = await quiz.createWithQuestion(1, 'gggggg    aaaaa', ['lllll', '345234', '3241234'], app);
      question = res[0].question;

      await request(app.getHttpServer())
        .get(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .query({ pageSize: 50, sorBy: 'body', sortDirection: 'asc' })
        .then(({ body }) => {
          console.log(body);
          expect(body.items).toHaveLength(3);
          expect(body.items[0]).toEqual({
            id: expect.any(String),
            body: 'What is my name?',
            correctAnswers: expect.any(Array),
            published: false,
            createdAt: expect.any(String),
            updatedAt: null,
          });
        });
    });
    it.skip(`04 - PUT -> "/sa/quiz/questions/:id": should update quiz question; status 204; used additional methods: POST -> /sa/quiz/questions, GET -> /sa/quiz/questions;`, async () => {
      await request(app.getHttpServer())
        .put(endpoints.saController.quiz + `/${question.id}`)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .query({ pageSize: 50, sorBy: 'body', sortDirection: 'asc' })
        .then(({ body }) => {
          console.log(body);
          expect(body.items).toHaveLength(3);
          expect(body.items[0]).toEqual({
            id: expect.any(String),
            body: 'What is my name?',
            correctAnswers: expect.any(Array),
            published: false,
            createdAt: expect.any(String),
            updatedAt: null,
          });
        });
    });
  });

  describe(`24 -  Access right for game flow`, () => {
    const quiz = new FactoryQuiz();
    const factory = new FactoryT();
    let accessToken0: string;
    let accessToken1: string;
    let accessToken2: string;
    let user0: UsersViewType;
    let user1: UsersViewType;
    let user2: UsersViewType;
    it(`00 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`01 - GET -> "/pair-game-quiz/pairs/:id": create new game by user1, get game by user2. Should return error if current user tries to get pair in which not participated; status 403; used additional methods: DELETE -> /testing/all-data, POST -> /sa/users, POST -> /auth/login, POST -> /sa/quiz/questions, PUT -> /sa/quiz/questions/:questionId/publish, POST -> /pair-game-quiz/pairs/connection;`, async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Alex', 'Sania'], app);
      await quiz.createWithQuestion(1, 'How many wheels does a three axle car have?', ['Six', '6'], app);
      await quiz.createWithQuestion(1, 'What shape is the moon?', ['circle', 'oval', 'ellipse'], app);
      await quiz.createWithQuestion(1, 'What was Jobs first name?', ['Steven', 'Paul'], app);
      await quiz.createWithQuestion(1, 'How many angles are in a right triangle?', ['3', 'three'], app);
      await quiz.createWithQuestion(1, 'in what year was born abolished serfdom in Poland?', ['1984'], app);
      await request(app.getHttpServer())
        .get(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .then(({ body }) => {
          expect(body.items).toHaveLength(6);
        });
      const res = await factory.createUniqueUserByLoginAndEmail(1, 'asirius', 'asirius@jive.com', app);
      user0 = res[0].user;
      accessToken0 = res[0].accessToken;
      const res1 = await factory.createUniqueUserByLoginAndEmail(1, 'raccoon', 'raccoon@animal.raw', app);
      accessToken1 = res1[0].accessToken;
      user1 = res1[0].user;
      const res2 = await factory.createUniqueUserByLoginAndEmail(1, 'hacker', 'qwerty@hacker.ne', app);
      accessToken2 = res2[0].accessToken;
      user2 = res2[0].user;
      await quiz.connection(accessToken0, app);
      await quiz.connection(accessToken1, app);
      await request(app.getHttpServer())
        .get(endpoints.quizController.id + `/6973e055-4889-414d-834f-566346603722`)
        .auth(accessToken0, { type: 'bearer' })
        .expect(403);
      //
      // await request(app.getHttpServer())
      //   .post(endpoints.quizController.connection)
      //   .auth(accessToken2, { type: 'bearer' })
      //   .expect(403);
      //
      // await quiz.answer('Alex', accessToken0, app);
      // await quiz.answer('alex', accessToken1, app);
      // await quiz.answer('Six', accessToken0, app);
      // await quiz.answer('circle', accessToken0, app);
      // await quiz.answer('6', accessToken1, app);
      // await quiz.answer('paul', accessToken1, app);
      // await quiz.answer('Steven', accessToken0, app);
      // await quiz.answer('3', accessToken0, app);
      // await quiz.answer('1984', accessToken1, app);
      // await quiz.answer('1984', accessToken1, app);
      // await quiz.connection(accessToken0, app);
    });
    it(`02 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`03 - GET -> "/pair-game-quiz/pairs/connection": create new game by user1, connect to game by user2, try to connect by user1, user2. Should return error if current user is already participating in active pair; status 403; used additional methods: DELETE -> /testing/all-data, POST -> /sa/users, POST -> /auth/login, POST -> /sa/quiz/questions, PUT -> /sa/quiz/questions/:questionId/publish, POST -> /pair-game-quiz/pairs/connection;`, async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Alex', 'Sania'], app);
      await quiz.createWithQuestion(1, 'How many wheels does a three axle car have?', ['Six', '6'], app);
      await quiz.createWithQuestion(1, 'What shape is the moon?', ['circle', 'oval', 'ellipse'], app);
      await quiz.createWithQuestion(1, 'What was Jobs first name?', ['Steven', 'Paul'], app);
      await quiz.createWithQuestion(1, 'How many angles are in a right triangle?', ['3', 'three'], app);
      await quiz.createWithQuestion(1, 'in what year was born abolished serfdom in Poland?', ['1984'], app);
      await request(app.getHttpServer())
        .get(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .then(({ body }) => {
          expect(body.items).toHaveLength(6);
        });
      const res = await factory.createUniqueUserByLoginAndEmail(1, 'asirius', 'asirius@jive.com', app);
      accessToken0 = res[0].accessToken;
      const res1 = await factory.createUniqueUserByLoginAndEmail(1, 'raccoon', 'raccoon@animal.raw', app);
      accessToken1 = res1[0].accessToken;
      await quiz.connection(accessToken0, app);
      await quiz.connection(accessToken1, app);
      await request(app.getHttpServer())
        .post(endpoints.quizController.connection)
        .auth(accessToken0, { type: 'bearer' })
        .expect(403);
      await request(app.getHttpServer())
        .post(endpoints.quizController.connection)
        .auth(accessToken1, { type: 'bearer' })
        .expect(403);
    });
    it(`04 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`05 - GET -> "/pair-game-quiz/pairs/connection": create new game by user1, try to connect by user1. Should return error if current user is already participating in active pair; status 403; used additional methods: DELETE -> /testing/all-data, POST -> /sa/users, POST -> /auth/login, POST -> /sa/quiz/questions, PUT -> /sa/quiz/questions/:questionId/publish, POST -> /pair-game-quiz/pairs/connection;`, async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Alex', 'Sania'], app);
      await quiz.createWithQuestion(1, 'How many wheels does a three axle car have?', ['Six', '6'], app);
      await quiz.createWithQuestion(1, 'What shape is the moon?', ['circle', 'oval', 'ellipse'], app);
      await quiz.createWithQuestion(1, 'What was Jobs first name?', ['Steven', 'Paul'], app);
      await quiz.createWithQuestion(1, 'How many angles are in a right triangle?', ['3', 'three'], app);
      await quiz.createWithQuestion(1, 'in what year was born abolished serfdom in Poland?', ['1984'], app);
      await request(app.getHttpServer())
        .get(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .then(({ body }) => {
          expect(body.items).toHaveLength(6);
        });
      const res = await factory.createUniqueUserByLoginAndEmail(1, 'asirius', 'asirius@jive.com', app);
      accessToken0 = res[0].accessToken;
      // const res1 = await factory.createUniqueUserByLoginAndEmail(1, 'raccoon', 'raccoon@animal.raw', app);
      // accessToken1 = res1[0].accessToken;
      await quiz.connection(accessToken0, app);
      await request(app.getHttpServer())
        .post(endpoints.quizController.connection)
        .auth(accessToken0, { type: 'bearer' })
        .expect(403);
    });
    it(`06 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`07 - GET -> "/pair-game-quiz/pairs/my-current/answers": create new game by user1, connect by user2, try to add answer by user3. Should return error if current user is not inside active pair; status 403; used additional methods: DELETE -> /testing/all-data, POST -> /sa/users, POST -> /auth/login, POST -> /sa/quiz/questions, PUT -> /sa/quiz/questions/:questionId/publish;`, async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Alex', 'Sania'], app);
      await quiz.createWithQuestion(1, 'How many wheels does a three axle car have?', ['Six', '6'], app);
      await quiz.createWithQuestion(1, 'What shape is the moon?', ['circle', 'oval', 'ellipse'], app);
      await quiz.createWithQuestion(1, 'What was Jobs first name?', ['Steven', 'Paul'], app);
      await quiz.createWithQuestion(1, 'How many angles are in a right triangle?', ['3', 'three'], app);
      await quiz.createWithQuestion(1, 'in what year was born abolished serfdom in Poland?', ['1984'], app);
      await request(app.getHttpServer())
        .get(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .then(({ body }) => {
          expect(body.items).toHaveLength(6);
        });
      const res = await factory.createUniqueUserByLoginAndEmail(1, 'asirius', 'asirius@jive.com', app);
      user0 = res[0].user;
      accessToken0 = res[0].accessToken;
      const res1 = await factory.createUniqueUserByLoginAndEmail(1, 'raccoon', 'raccoon@animal.raw', app);
      accessToken1 = res1[0].accessToken;
      user1 = res1[0].user;
      const res2 = await factory.createUniqueUserByLoginAndEmail(1, 'hacker', 'qwerty@hacker.ne', app);
      accessToken2 = res2[0].accessToken;
      user2 = res2[0].user;
      await quiz.connection(accessToken0, app);
      await quiz.connection(accessToken1, app);
      await request(app.getHttpServer())
        .post(endpoints.quizController.answer)
        .auth(accessToken2, { type: 'bearer' })
        .send({
          answer: 'Alex',
        })
        .expect(403);

      //
      // await request(app.getHttpServer())
      //   .post(endpoints.quizController.connection)
      //   .auth(accessToken2, { type: 'bearer' })
      //   .expect(403);
      //
      // await quiz.answer('Alex', accessToken0, app);
      // await quiz.answer('alex', accessToken1, app);
      // await quiz.answer('Six', accessToken0, app);
      // await quiz.answer('circle', accessToken0, app);
      // await quiz.answer('6', accessToken1, app);
      // await quiz.answer('paul', accessToken1, app);
      // await quiz.answer('Steven', accessToken0, app);
      // await quiz.answer('3', accessToken0, app);
      // await quiz.answer('1984', accessToken1, app);
      // await quiz.answer('1984', accessToken1, app);
      // await quiz.connection(accessToken0, app);
    });
    it(`08 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`09 - GET -> "/pair-game-quiz/pairs/my-current/answers": create new game by user1, try to add answer by user1. Should return error if current user is not inside active pair; status 403; used additional methods: DELETE -> /testing/all-data, POST -> /sa/users, POST -> /auth/login, POST -> /sa/quiz/questions, PUT -> /sa/quiz/questions/:questionId/publish, POST -> /pair-game-quiz/pairs/connection;`, async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Alex', 'Sania'], app);
      await quiz.createWithQuestion(1, 'How many wheels does a three axle car have?', ['Six', '6'], app);
      await quiz.createWithQuestion(1, 'What shape is the moon?', ['circle', 'oval', 'ellipse'], app);
      await quiz.createWithQuestion(1, 'What was Jobs first name?', ['Steven', 'Paul'], app);
      await quiz.createWithQuestion(1, 'How many angles are in a right triangle?', ['3', 'three'], app);
      await quiz.createWithQuestion(1, 'in what year was born abolished serfdom in Poland?', ['1984'], app);
      await request(app.getHttpServer())
        .get(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .then(({ body }) => {
          expect(body.items).toHaveLength(6);
        });
      const res = await factory.createUniqueUserByLoginAndEmail(1, 'asirius', 'asirius@jive.com', app);
      user0 = res[0].user;
      accessToken0 = res[0].accessToken;
      const res1 = await factory.createUniqueUserByLoginAndEmail(1, 'raccoon', 'raccoon@animal.raw', app);
      accessToken1 = res1[0].accessToken;
      user1 = res1[0].user;
      await quiz.connection(accessToken0, app);
      await request(app.getHttpServer())
        .post(endpoints.quizController.answer)
        .auth(accessToken0, { type: 'bearer' })
        .send({
          answer: 'Alex',
        })
        .expect(403);
    });
    it(`10 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`11 - GET -> "/pair-game-quiz/pairs/my-current/answers": create new game by user1, connect to game by user2, add 6 answers by user1. Should return error if current user has already answered to all questions; status 403; used additional methods: DELETE -> /testing/all-data, POST -> /sa/users, POST -> /auth/login, POST -> /sa/quiz/questions, PUT -> /sa/quiz/questions/:questionId/publish, POST -> /pair-game-quiz/pairs/connection, POST -> /pair-game-quiz/pairs/my-current/answers;`, async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Alex', 'Sania'], app);
      await quiz.createWithQuestion(1, 'How many wheels does a three axle car have?', ['Six', '6'], app);
      await quiz.createWithQuestion(1, 'What shape is the moon?', ['circle', 'oval', 'ellipse'], app);
      await quiz.createWithQuestion(1, 'What was Jobs first name?', ['Steven', 'Paul'], app);
      await quiz.createWithQuestion(1, 'How many angles are in a right triangle?', ['3', 'three'], app);
      await quiz.createWithQuestion(1, 'in what year was born abolished serfdom in Poland?', ['1984'], app);
      await request(app.getHttpServer())
        .get(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .then(({ body }) => {
          expect(body.items).toHaveLength(6);
        });
      const res = await factory.createUniqueUserByLoginAndEmail(1, 'asirius', 'asirius@jive.com', app);
      user0 = res[0].user;
      accessToken0 = res[0].accessToken;
      const res1 = await factory.createUniqueUserByLoginAndEmail(1, 'raccoon', 'raccoon@animal.raw', app);
      accessToken1 = res1[0].accessToken;
      user1 = res1[0].user;
      await quiz.connection(accessToken0, app);
      await quiz.connection(accessToken1, app);
      await quiz.answer('Alex', accessToken0, app);
      await quiz.answer('Six', accessToken0, app);
      await quiz.answer('circle', accessToken0, app);
      await quiz.answer('Steven', accessToken0, app);
      await quiz.answer('3', accessToken0, app);
      await request(app.getHttpServer())
        .post(endpoints.quizController.answer)
        .auth(accessToken0, { type: 'bearer' })
        .send({
          answer: '6',
        })
        .expect(403);
    });
    it(`12 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`13 - GET -> "/pair-game-quiz/pairs/my-current": create new game by user1, connect to game by user2, add all answers by users. Should return error if no active pair for current user; status 404; used additional methods: DELETE -> /testing/all-data, POST -> /sa/users, POST -> /auth/login, POST -> /pair-game-quiz/pairs/connection, POST -> /sa/quiz/questions, PUT -> /sa/quiz/questions/:questionId/publish, POST -> /pair-game-quiz/pairs/my-current/answers;`, async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Alex', 'Sania'], app);
      await quiz.createWithQuestion(1, 'How many wheels does a three axle car have?', ['Six', '6'], app);
      await quiz.createWithQuestion(1, 'What shape is the moon?', ['circle', 'oval', 'ellipse'], app);
      await quiz.createWithQuestion(1, 'What was Jobs first name?', ['Steven', 'Paul'], app);
      await quiz.createWithQuestion(1, 'How many angles are in a right triangle?', ['3', 'three'], app);
      await quiz.createWithQuestion(1, 'in what year was born abolished serfdom in Poland?', ['1984'], app);
      await request(app.getHttpServer())
        .get(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .then(({ body }) => {
          expect(body.items).toHaveLength(6);
        });
      const res = await factory.createUniqueUserByLoginAndEmail(1, 'asirius', 'asirius@jive.com', app);
      user0 = res[0].user;
      accessToken0 = res[0].accessToken;
      const res1 = await factory.createUniqueUserByLoginAndEmail(1, 'raccoon', 'raccoon@animal.raw', app);
      accessToken1 = res1[0].accessToken;
      user1 = res1[0].user;
      await quiz.connection(accessToken0, app);
      await quiz.connection(accessToken1, app);
      await quiz.answer('Alex', accessToken0, app);
      await quiz.answer('Six', accessToken0, app);
      await quiz.answer('circle', accessToken0, app);
      await quiz.answer('Steven', accessToken0, app);
      await quiz.answer('1984', accessToken0, app);
      await quiz.answer('3', accessToken1, app);
      await quiz.answer('Six', accessToken1, app);
      await quiz.answer('Alex', accessToken1, app);
      await quiz.answer('7', accessToken1, app);
      await quiz.answer('1984', accessToken1, app);
      // await request(app.getHttpServer())
      //   .get(endpoints.quizController.my_current)
      //   .auth(accessToken0, { type: 'bearer' })
      //   .expect(404);
      // await request(app.getHttpServer())
      //   .get(endpoints.quizController.my_current)
      //   .auth(accessToken1, { type: 'bearer' })
      //   .expect(404);
    });
    it('should ', async () => {
      await request(app.getHttpServer())
        .get(endpoints.quizController.my_current)
        .auth(accessToken0, { type: 'bearer' })
        .expect(404);
      await request(app.getHttpServer())
        .get(endpoints.quizController.my_current)
        .auth(accessToken1, { type: 'bearer' })
        .expect(404);
    });

    it.skip(`02 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
  });
  describe(`24 -  Exceptions for game flow`, () => {
    const quiz = new FactoryQuiz();
    const factory = new FactoryT();
    let accessToken: string;
    let refreshTokenKey: string, validRefreshToken: string, refreshToken: string;
    let accessToken1: string;
    let accessToken2: string;
    let user: UsersViewType;
    let user1: UsersViewType;
    let user2: UsersViewType;
    it(`14 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`15 - POST -> "/sa/users": should create new user; status 201; content: created user; used additional methods: GET => /sa/users;`, async () => {
      const res = await factory.createUniqueUserByLoginAndEmail(1, 'asirius', 'asirius@jive.com', app);
      user = res[0].user;
      accessToken = res[0].accessToken;
      const res1 = await factory.createUniqueUserByLoginAndEmail(1, 'raccoon', 'raccoon@animal.raw', app);
      accessToken1 = res1[0].accessToken;
      await request(app.getHttpServer())
        .get(endpoints.saController.users)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
              {
                id: expect.any(String),
                login: 'raccoon',
                email: 'raccoon@animal.raw',
                createdAt: expect.any(String),
                banInfo: { isBanned: false, banDate: null, banReason: null },
              },
              {
                id: expect.any(String),
                login: 'asirius',
                email: 'asirius@jive.com',
                createdAt: expect.any(String),
                banInfo: { isBanned: false, banDate: null, banReason: null },
              },
            ],
          });
        });
    });
    it("16 - POST -> \"/auth/login\": should sign in user; status 200; content: JWT 'access' token, JWT 'refresh' token in cookie (http only, secure);", async () => {
      await request(app.getHttpServer())
        .post(endpoints.authController.login)
        .set(`User-Agent`, `for test`)
        .send({
          loginOrEmail: 'asirius@jive.com',
          password: 'asirius0',
        })
        .expect(200)
        .then(({ body, headers }) => {
          accessToken = body;
          refreshToken = headers['set-cookie'];
          expect(accessToken).toEqual({ accessToken: expect.any(String) });
          accessToken = body.accessToken;
        });

      expect(refreshToken[0]).toBeTruthy();
      if (!refreshToken) return;
      [refreshTokenKey, validRefreshToken] = refreshToken[0].split(';')[0].split('=');
      expect(refreshTokenKey).toBe(`refreshToken`);
      expect(refreshToken[0].includes(`HttpOnly`)).toBeTruthy();
      expect(refreshToken[0].includes(`Secure`)).toBeTruthy();
    });
    it('17 - POST -> "/sa/quiz/questions", PUT -> "/sa/quiz/questions/:questionId/publish": should create and publish several questions; status 201; content: created question;', async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Alex', 'Sania'], app);
      await quiz.createWithQuestion(1, 'How many wheels does a three axle car have?', ['Six', '6'], app);
      await quiz.createWithQuestion(1, 'What shape is the moon?', ['circle', 'oval', 'ellipse'], app);
      await quiz.createWithQuestion(1, 'What was Jobs first name?', ['Steven', 'Paul'], app);
      await quiz.createWithQuestion(1, 'How many angles are in a right triangle?', ['3', 'three'], app);
      await quiz.createWithQuestion(1, 'in what year was born abolished serfdom in Poland?', ['1984'], app);
      await request(app.getHttpServer())
        .get(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .then(({ body }) => {
          expect(body.items).toHaveLength(6);
        });
    });
    it(`18 - GET -> "/pair-game-quiz/pairs/my-current": should return error if such game does not exist; status 404;`, async () => {
      await request(app.getHttpServer())
        .get(endpoints.quizController.my_current)
        .auth(accessToken, { type: 'bearer' })
        .expect(404);
    });
    it(`19 - GET -> "/pair-game-quiz/pairs/my-current": should return error if there is no active pair for current user; status 404;`, async () => {
      await quiz.connection(accessToken, app);
      await request(app.getHttpServer())
        .get(endpoints.quizController.my_current)
        .auth(accessToken, { type: 'bearer' })
        .expect(404);
    });
    it.skip(`20 - GET -> "/pair-game-quiz/pairs/my-current", GET -> "pair-game-quiz/pairs/:id", POST -> "pair-game-quiz/pairs/connection", POST -> "pair-game-quiz/pairs/my-current/answers": should return error if auth credentials is incorrect; status 404; used additional methods: POST -> /pair-game-quiz/pairs/connection;`, async () => {
      await quiz.connection(accessToken1, app);
      await request(app.getHttpServer())
        .get(endpoints.quizController.id + `/aca4f943-1566-4ad9-9cf7-e8963f7196f5`)
        .auth(accessToken, { type: 'bearer' })
        .expect(404);
      await request(app.getHttpServer())
        .get(endpoints.quizController.my_current)
        .auth(accessToken, { type: 'bearer' })
        .expect(404);
      await request(app.getHttpServer())
        .post(endpoints.quizController.connection)
        .auth(accessToken, { type: 'bearer' })
        .expect(404);
    });
    it(`20 - GET -> "/pair-game-quiz/pairs/:id": should return error if id has invalid format; status 404;`, async () => {
      await quiz.connection(accessToken1, app);
      await request(app.getHttpServer())
        .get(endpoints.quizController.id + `/aca4f943-1566-4ad9-9cf7-e8963f7196f`)
        .auth(accessToken, { type: 'bearer' })
        .expect(404);
    });
  });
  describe(`24 -  Create, connect games, add answers`, () => {
    const quiz = new FactoryQuiz();
    const factory = new FactoryT();
    let accessToken1: string;
    let accessToken2: string;
    let accessToken3: string;
    let accessToken4: string;
    let accessToken5: string;
    let accessToken6: string;
    let user1: UsersViewType;
    let user2: UsersViewType;
    let user3: UsersViewType;
    let user4: UsersViewType;
    let user5: UsersViewType;
    let user6: UsersViewType;
    it(`21 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController.allData).expect(204);
    });
    it(`22 - POST -> "/sa/users", "/auth/login": should create and login 6 users; status 201; content: created users;`, async () => {
      const response = await factory.createUserByLoginEmail(6, app);
      accessToken1 = response[0].accessToken;
      accessToken2 = response[1].accessToken;
      accessToken3 = response[2].accessToken;
      accessToken4 = response[3].accessToken;
      accessToken5 = response[4].accessToken;
      accessToken6 = response[5].accessToken;
    });
    it(`23 - POST -> "/sa/quiz/questions", PUT -> "/sa/quiz/questions/:questionId/publish": should create and publish several questions; status 201; content: created question;`, async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Alex', 'Sania'], app);
      await quiz.createWithQuestion(1, 'How many wheels does a three axle car have?', ['Six', '6'], app);
      await quiz.createWithQuestion(1, 'What shape is the moon?', ['circle', 'oval', 'ellipse'], app);
      await quiz.createWithQuestion(1, 'What was Jobs first name?', ['Steven', 'Paul'], app);
    });
    it(`24 - POST -> "/pair-game-quiz/pairs/connection", GET -> "/pair-game-quiz/pairs/:id", GET -> "/pair-game-quiz/pairs/my-current": create new active game by user1, then get the game by user1, then call "/pair-game-quiz/pairs/my-current" by user1. Should return new created active game; status 200;`, async () => {
      await quiz.connection(accessToken1, app);
      await quiz.connection(accessToken2, app);
      await request(app.getHttpServer())
        .get(endpoints.quizController.my_current)
        .auth(accessToken1, { type: 'bearer' })
        .expect(200)
        .then(({ body }) => {
          console.log(body);
        });
    });
  });
});
