import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { createdApp } from '../src/helpers/createdApp';
import { endpoints } from './helpers/routing';
import { FactoryT, superUser } from './helpers/factory-t';
import { FactoryQuiz } from './helpers/factory-quiz';
import { UsersViewType } from '../src/modules/users/infrastructure/query-reposirory/user-View-Model';
import { GameViewModel } from '../src/modules/quiz/infrastructure/query-repository/game-View-Model';
import { QuestionForSaViewModel } from '../src/modules/sa/infrastructure/query-reposirory/question-for-sa-view-model';

jest.setTimeout(1200000);

describe(`Quiz `, () => {
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

  describe(`24 -  Access right for game flow`, () => {
    const quiz = new FactoryQuiz();
    const factory = new FactoryT();
    let accessToken0: string;
    let accessToken1: string;
    let accessToken2: string;
    let game: GameViewModel;
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
      game = await quiz.connection(accessToken0, app);
      await request(app.getHttpServer())
        .get(endpoints.quizController.id + `/${game.id}`)
        .auth(accessToken1, { type: 'bearer' })
        .expect(403);
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
  });
  describe(`24 -  Exceptions for game flow`, () => {
    const quiz = new FactoryQuiz();
    const factory = new FactoryT();
    let accessToken: string;
    let accessToken1: string;
    let game: GameViewModel;
    let refreshTokenKey: string, validRefreshToken: string, refreshToken: string;
    let user: UsersViewType;
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
      await request(app.getHttpServer())
        .get(endpoints.quizController.my_current)
        .auth(accessToken, { type: 'bearer' })
        .expect(404);
    });

    it.skip(`20 - GET -> "/pair-game-quiz/pairs/my-current", GET -> "pair-game-quiz/pairs/:id", POST -> "pair-game-quiz/pairs/connection", POST -> "pair-game-quiz/pairs/my-current/answers": should return error if auth credentials is incorrect; status 404; used additional methods: POST -> /pair-game-quiz/pairs/connection;`, async () => {
      game = await quiz.connection(accessToken, app);
      await request(app.getHttpServer())
        .get(endpoints.quizController.my_current)
        .auth(accessToken1, { type: 'bearer' })
        .expect(404);
      await request(app.getHttpServer())
        .get(endpoints.quizController.id + `/${game.id}`)
        .auth(accessToken1, { type: 'bearer' })
        .expect(404);
    });
    it(`20 - GET -> "/pair-game-quiz/pairs/:id": should return error if id has invalid format; status 404;`, async () => {
      await request(app.getHttpServer())
        .get(endpoints.quizController.id + `/aca4f943-1566-4ad9-9cf7-e8f`)
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
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
    let game: GameViewModel;
    let game2: GameViewModel;
    let game3: GameViewModel;
    let game4: GameViewModel;
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
      await quiz.createWithQuestion(1, 'What is my name?', ['Alex'], app); //question 1
      await quiz.createWithQuestion(1, 'How many wheels does a three axle car have?', ['Alex'], app); //question 2
      await quiz.createWithQuestion(1, 'What shape is the moon?', ['Alex'], app); //question 3
      await quiz.createWithQuestion(1, 'What was Jobs first name?', ['Alex'], app); // question 4
      await quiz.createWithQuestion(1, 'How many angles are in a right triangle?', ['Alex'], app); //question 5
    });
    it(`24 - POST -> "/pair-game-quiz/pairs/connection", GET -> "/pair-game-quiz/pairs/:id", GET -> "/pair-game-quiz/pairs/my-current": create new active game by user1, then get the game by user1, then call "/pair-game-quiz/pairs/my-current" by user1. Should return new created active game; status 200;`, async () => {
      game = await quiz.connection(accessToken1, app);
      expect(game).toEqual({
        id: expect.any(String),
        firstPlayerProgress: {
          answers: [],
          player: { id: expect.any(String), login: 'asi-0' },
          score: 0,
        },
        secondPlayerProgress: null,
        questions: null,
        status: 'PendingSecondPlayer',
        pairCreatedDate: expect.any(String),
        startGameDate: null,
        finishGameDate: null,
      });
      await request(app.getHttpServer())
        .get(endpoints.quizController.id + `/${game.id}`)
        .auth(accessToken1, { type: 'bearer' })
        .expect(200)
        .then(({ body }) => {
          expect(body.questions).toBeNull();
          expect(body.firstPlayerProgress).toEqual({
            answers: [],
            player: { id: expect.any(String), login: 'asi-0' },
            score: 0,
          });
          expect(body.secondPlayerProgress).toBeNull();
          expect(body.status).toEqual('PendingSecondPlayer');
          expect(body.pairCreatedDate).toEqual(expect.any(String));
          expect(body.startGameDate).toBeNull();
          expect(body.finishGameDate).toBeNull();
        });
      await request(app.getHttpServer())
        .get(endpoints.quizController.my_current)
        .auth(accessToken1, { type: 'bearer' })
        .expect(200)
        .then(({ body }) => {
          expect(body.questions).toBeNull();
          expect(body.firstPlayerProgress).toEqual({
            answers: [],
            player: { id: expect.any(String), login: 'asi-0' },
            score: 0,
          });
          expect(body.secondPlayerProgress).toBeNull();
          expect(body.status).toEqual('PendingSecondPlayer');
          expect(body.pairCreatedDate).toEqual(expect.any(String));
          expect(body.startGameDate).toBeNull();
          expect(body.finishGameDate).toBeNull();
        });
    });
    it('25 - POST -> "/pair-game-quiz/pairs/connection",  GET -> "/pair-game-quiz/pairs/:id", GET -> "/pair-game-quiz/pairs/my-current": connect to existing game by user2; then get the game by user1, user2; then call "/pair-game-quiz/pairs/my-current" by user1, user2. Should return started game; status 200;', async () => {
      game = await quiz.connection(accessToken2, app);
      await request(app.getHttpServer())
        .get(endpoints.quizController.id + `/${game.id}`)
        .auth(accessToken1, { type: 'bearer' })
        .expect(200)
        .then(({ body }) => {
          expect(body.questions).toHaveLength(5);
          expect(body.firstPlayerProgress).toEqual({
            answers: [],
            player: { id: expect.any(String), login: 'asi-0' },
            score: 0,
          });
          expect(body.secondPlayerProgress).toEqual({
            answers: [],
            player: { id: expect.any(String), login: 'asi-1' },
            score: 0,
          });
          expect(body.status).toEqual('Active');
          expect(body.pairCreatedDate).toEqual(expect.any(String));
          expect(body.startGameDate).toEqual(expect.any(String));
          expect(body.finishGameDate).toBeNull();
        });
      await request(app.getHttpServer())
        .get(endpoints.quizController.id + `/${game.id}`)
        .auth(accessToken2, { type: 'bearer' })
        .expect(200)
        .then(({ body }) => {
          expect(body.questions).toHaveLength(5);
          expect(body.firstPlayerProgress).toEqual({
            answers: [],
            player: { id: expect.any(String), login: 'asi-0' },
            score: 0,
          });
          expect(body.secondPlayerProgress).toEqual({
            answers: [],
            player: { id: expect.any(String), login: 'asi-1' },
            score: 0,
          });
          expect(body.status).toEqual('Active');
          expect(body.pairCreatedDate).toEqual(expect.any(String));
          expect(body.startGameDate).toEqual(expect.any(String));
          expect(body.finishGameDate).toBeNull();
        });
      await request(app.getHttpServer())
        .get(endpoints.quizController.my_current)
        .auth(accessToken1, { type: 'bearer' })
        .expect(200)
        .then(({ body }) => {
          expect(body.questions).toHaveLength(5);
          expect(body.firstPlayerProgress).toEqual({
            answers: [],
            player: { id: expect.any(String), login: 'asi-0' },
            score: 0,
          });
          expect(body.secondPlayerProgress).toEqual({
            answers: [],
            player: { id: expect.any(String), login: 'asi-1' },
            score: 0,
          });
          expect(body.status).toEqual('Active');
          expect(body.pairCreatedDate).toEqual(expect.any(String));
          expect(body.startGameDate).toEqual(expect.any(String));
          expect(body.finishGameDate).toBeNull();
        });
      await request(app.getHttpServer())
        .get(endpoints.quizController.my_current)
        .auth(accessToken2, { type: 'bearer' })
        .expect(200)
        .then(({ body }) => {
          expect(body.questions).toHaveLength(5);
          expect(body.firstPlayerProgress).toEqual({
            answers: [],
            player: { id: expect.any(String), login: 'asi-0' },
            score: 0,
          });
          expect(body.secondPlayerProgress).toEqual({
            answers: [],
            player: { id: expect.any(String), login: 'asi-1' },
            score: 0,
          });
          expect(body.status).toEqual('Active');
          expect(body.pairCreatedDate).toEqual(expect.any(String));
          expect(body.startGameDate).toEqual(expect.any(String));
          expect(body.finishGameDate).toBeNull();
        });
    });
    it(
      '26 -  POST -> "/pair-game-quiz/pairs/my-current/answers",\n' +
        '  GET -> "/pair-game-quiz/pairs", GET -> "/pair-game-quiz/pairs/my-current": add answers to first game, created by user1, connected by user2:\n' +
        'add correct answer by firstPlayer;\n' +
        'add incorrect answer by secondPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'get active game and call "/pair-game-quiz/pairs/my-current by both users after each answer"\n' +
        '; status 200;',
      async () => {
        const answer1_1 = await quiz.answer('Alex', accessToken1, app); //correct answer for 1 question
        expect(answer1_1).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken1, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(0);
          });
        const answer1_2 = await quiz.answer('Alexandro', accessToken2, app); //incorrect answer for 1 question
        expect(answer1_2).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken2, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(0);
          });
        const answer2_2 = await quiz.answer('Alex', accessToken2, app); //correct answer for 2 question
        expect(answer2_2).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken1, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        // - - 3 questions
      },
    );
    it(
      '27 - POST -> "/pair-game-quiz/pairs/my-current/answers",\n' +
        '  GET -> "/pair-game-quiz/pairs", GET -> "/pair-game-quiz/pairs/my-current": create second game by user3, connect to the game by user4, then:\n' +
        'add correct answer by firstPlayer;\n' +
        'add incorrect answer by secondPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'get active game and call "/pair-game-quiz/pairs/my-current by both users after each answer"\n' +
        '; status 200; ',
      async () => {
        await quiz.connection(accessToken3, app);
        game2 = await quiz.connection(accessToken4, app);
        //answer in
        const answer3_1 = await quiz.answer('Alex', accessToken3, app); //correct answer for 1 question
        expect(answer3_1).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken3, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(0);
          });
        const answer4_1 = await quiz.answer('Alexandro', accessToken4, app); //incorrect answer for 1 question
        expect(answer4_1).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken4, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(0);
          });
        const answer4_2 = await quiz.answer('Alex', accessToken4, app); //correct answer for 2 question
        expect(answer4_2).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken3, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        // - 3 questions
      },
    );
    it(
      '28 - POST -> "/pair-game-quiz/pairs/my-current/answers",\n' +
        '  GET -> "/pair-game-quiz/pairs", GET -> "/pair-game-quiz/pairs/my-current": add answers to first game, created by user1, connected by user2:\n' +
        'add correct answer by firstPlayer;\n' +
        'add correct answer by firstPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'add incorrect answer by firstPlayer;\n' +
        'add correct answer by firstPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'firstPlayer should win with 5 scores;\n' +
        'get active game and call "/pair-game-quiz/pairs/my-current by both users after each answer"\n' +
        '; status 200; ',
      async () => {
        const answer1_2 = await quiz.answer('Alex', accessToken1, app); //correct answer for 2 question
        expect(answer1_2).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken1, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(2);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        const answer1_3 = await quiz.answer('Alex', accessToken1, app); //correct answer for 3 question
        expect(answer1_3).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken1, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(3);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        const answer2_3 = await quiz.answer('Alex', accessToken2, app); //correct answer for 3 question
        expect(answer2_3).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken2, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(3);
            expect(body.secondPlayerProgress.score).toEqual(2);
          });
        const answer2_4 = await quiz.answer('Alex', accessToken2, app); //correct answer for 4 question
        expect(answer2_4).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken2, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(3);
            expect(body.secondPlayerProgress.score).toEqual(3);
          });
        const answer1_4 = await quiz.answer('1984', accessToken1, app); //incorrect answer for 4 question
        expect(answer1_4).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken1, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(3);
            expect(body.secondPlayerProgress.score).toEqual(3);
          });
        const answer1_5 = await quiz.answer('Alex', accessToken1, app); //correct answer for 5 question
        expect(answer1_5).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken2, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(4);
            expect(body.secondPlayerProgress.score).toEqual(3);
          });
        const answer2_5 = await quiz.answer('Alex', accessToken2, app); //correct answer for 5 question
        expect(answer2_5).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.id + `/${game.id}`)
          .auth(accessToken2, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(5);
            expect(body.secondPlayerProgress.score).toEqual(4);
          });
        //finish game
      },
    );
    it(
      '29 - POST -> "/pair-game-quiz/pairs/my-current/answers",\n' +
        '  GET -> "/pair-game-quiz/pairs", GET -> "/pair-game-quiz/pairs/my-current": create third game by user2, connect to the game by user1, then:\n' +
        'add correct answer by firstPlayer;\n' +
        'add incorrect answer by secondPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'get active game and call "/pair-game-quiz/pairs/my-current by both users after each answer"\n' +
        '; status 200;',
      async () => {
        //start third game user2 and user1
        await quiz.connection(accessToken2, app);
        game3 = await quiz.connection(accessToken1, app);
        const answer1_1 = await quiz.answer('Alex', accessToken2, app); //correct answer for 1 question
        expect(answer1_1).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken1, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(0);
          });
        const answer2_1 = await quiz.answer('Alexandro', accessToken1, app); //incorrect answer for 1 question
        expect(answer2_1).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken2, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(0);
          });
        const answer2_2 = await quiz.answer('Alex', accessToken1, app); //correct answer for 2 question
        expect(answer2_2).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken2, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        // --- 3 questions
      },
    );
    it(
      '30 - POST -> "/pair-game-quiz/pairs/my-current/answers",\n' +
        '  GET -> "/pair-game-quiz/pairs", GET -> "/pair-game-quiz/pairs/my-current": create 4th game by user5, connect to the game by user6, then:\n' +
        'add correct answer by firstPlayer;\n' +
        'add incorrect answer by firstPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'add incorrect answer by secondPlayer;\n' +
        'add incorrect answer by secondPlayer;\n' +
        'add incorrect answer by secondPlayer;\n' +
        'add incorrect answer by secondPlayer;\n' +
        'add correct answer by firstPlayer;\n' +
        'add incorrect answer by firstPlayer;\n' +
        'add incorrect answer by firstPlayer;\n' +
        'draw with 2 scores;\n' +
        'get active game and call "/pair-game-quiz/pairs/my-current by both users after each answer"\n' +
        '; status 200;',
      async () => {
        //start new a game
        await quiz.connection(accessToken5, app);
        game4 = await quiz.connection(accessToken6, app);
        const answer5_1 = await quiz.answer('Alex', accessToken5, app); //correct answer for 1 question
        expect(answer5_1).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken5, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(0);
          });
        const answer5_2 = await quiz.answer('Alexandro', accessToken5, app); //incorrect answer for 2 question
        expect(answer5_2).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken5, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(0);
          });
        const answer6_1 = await quiz.answer('Alex', accessToken6, app); //correct answer for 1 question
        expect(answer6_1).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken6, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        const answer6_2 = await quiz.answer('2', accessToken6, app); //incorrect answer for 2 question
        expect(answer6_2).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken6, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        const answer6_3 = await quiz.answer('2', accessToken6, app); //incorrect answer for 3 question
        expect(answer6_3).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken6, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        const answer6_4 = await quiz.answer('2', accessToken6, app); //incorrect answer for 4 question
        // await request(app.getHttpServer())
        //   .get(endpoints.quizController.my_current)
        //   .auth(accessToken4, { type: 'bearer' })
        //   .expect(200)
        //   .then(({ body }) => {
        //     console.log(body.firstPlayerProgress.score);
        //     console.log(body.secondPlayerProgress.score);
        //   });
        expect(answer6_4).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken6, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        const answer6_5 = await quiz.answer('2', accessToken6, app); //incorrect answer for 5 question
        expect(answer6_5).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.id + `/${game4.id}`)
          .auth(accessToken6, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(1);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        const answer5_3 = await quiz.answer('Alex', accessToken5, app); //correct answer for 3 question
        expect(answer5_3).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken5, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(2);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        const answer5_4 = await quiz.answer('free', accessToken5, app); //incorrect answer for 4 question
        expect(answer5_4).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.my_current)
          .auth(accessToken5, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(2);
            expect(body.secondPlayerProgress.score).toEqual(1);
          });
        const answer5_5 = await quiz.answer('bam', accessToken5, app); //incorrect answer for 5 question
        expect(answer5_5).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.id + `/${game4.id}`)
          .auth(accessToken5, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(2);
            expect(body.secondPlayerProgress.score).toEqual(2);
          });
      },
    );
    it(
      '31 - POST -> "/pair-game-quiz/pairs/my-current/answers",\n' +
        '  GET -> "/pair-game-quiz/pairs", GET -> "/pair-game-quiz/pairs/my-current": add answers to second game, created by user3, connected by user4:\n' +
        'add incorrect answer by firstPlayer;\n' +
        'add incorrect answer by firstPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'add incorrect answer by secondPlayer;\n' +
        'add correct answer by firstPlayer;\n' +
        'add incorrect answer by firstPlayer;\n' +
        'secondPlayer should win with 4 scores;\n' +
        'get active game and call "/pair-game-quiz/pairs/my-current by both users after each answer"\n' +
        '; status 200;',
      async () => {
        const answer3_2 = await quiz.answer('3', accessToken3, app); //incorrect answer for 2 question
        expect(answer3_2).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        const answer3_3 = await quiz.answer('3', accessToken3, app); //incorrect answer for 3 question
        expect(answer3_3).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });

        const answer4_3 = await quiz.answer('Alex', accessToken4, app); //correct answer for 3 question
        expect(answer4_3).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        const answer4_4 = await quiz.answer('Alex', accessToken4, app); //correct answer for 4 question
        expect(answer4_4).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });

        const answer4_5 = await quiz.answer('3', accessToken4, app); //incorrect answer for 5 question
        expect(answer4_5).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });

        const answer3_4 = await quiz.answer('Alex', accessToken3, app); //correct answer for 4 question
        expect(answer3_4).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });

        const answer3_5 = await quiz.answer('3', accessToken3, app); //incorrect answer for 5 question
        expect(answer3_5).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.id + `/${game2.id}`)
          .auth(accessToken3, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(2);
            expect(body.secondPlayerProgress.score).toEqual(4);
          });
      },
    );
    it(
      '32 - POST -> "/pair-game-quiz/pairs/my-current/answers",\n' +
        '  GET -> "/pair-game-quiz/pairs", GET -> "/pair-game-quiz/pairs/my-current": add answers to third game, created by user2, connected by user1:\n' +
        'add correct answer by firstPlayer;\n' +
        'add correct answer by firstPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'add incorrect answer by firstPlayer;\n' +
        'add correct answer by firstPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'firstPlayer should win with 5 scores;\n' +
        'get active game and call "/pair-game-quiz/pairs/my-current by both users after each answer"\n' +
        '; status 200;',
      async () => {
        const answer1_2 = await quiz.answer('Alex', accessToken2, app); //correct answer for 2 question
        expect(answer1_2).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        const answer1_3 = await quiz.answer('Alex', accessToken2, app); //correct answer for 3 question
        expect(answer1_3).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });

        const answer2_3 = await quiz.answer('Alex', accessToken1, app); //correct answer for 3 question
        expect(answer2_3).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });

        const answer2_4 = await quiz.answer('Alex', accessToken1, app); //correct answer for 4 question
        expect(answer2_4).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });

        const answer1_4 = await quiz.answer('gg', accessToken2, app); //incorrect answer for 4 question
        expect(answer1_4).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Incorrect',
          addedAt: expect.any(String),
        });
        // await request(app.getHttpServer())
        //   .get(endpoints.quizController.my_current)
        //   .auth(accessToken1, { type: 'bearer' })
        //   .expect(200)
        //   .then(({ body }) => {
        //     console.log(body.firstPlayerProgress.score);
        //     console.log(body.secondPlayerProgress.score);
        //   });
        // await request(app.getHttpServer())
        //   .get(endpoints.quizController.my_current)
        //   .auth(accessToken2, { type: 'bearer' })
        //   .expect(200)
        //   .then(({ body }) => {
        //     console.log(body.firstPlayerProgress.score);
        //     console.log(body.secondPlayerProgress.score);
        //   });
        const answer1_5 = await quiz.answer('Alex', accessToken2, app); //correct answer for 5 question
        expect(answer1_5).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });

        const answer2_5 = await quiz.answer('Alex', accessToken1, app); //correct answer for 5 question
        expect(answer2_5).toEqual({
          questionId: expect.any(String),
          answerStatus: 'Correct',
          addedAt: expect.any(String),
        });
        await request(app.getHttpServer())
          .get(endpoints.quizController.id + `/${game3.id}`)
          .auth(accessToken1, { type: 'bearer' })
          .expect(200)
          .then(({ body }) => {
            expect(body.firstPlayerProgress.score).toEqual(5);
            expect(body.secondPlayerProgress.score).toEqual(4);
          });
      },
    );
  });
  describe.skip(`factory questions`, () => {
    const quiz = new FactoryQuiz();
    let question: QuestionForSaViewModel;
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
});
