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
      await request(app.getHttpServer())
        .delete(endpoints.testingController.allData)
        .expect(204);
    });
    it(`01 - POST -> "/sa/quiz/questions": should create new question; status 201; content: created question; used additional methods: GET => /sa/quiz/questions;`, async () => {
      await quiz.createWithQuestion(
        1,
        'What is my name?',
        ['Calypso', 'Matias', 'Colombo'],
        app,
      );
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
      await request(app.getHttpServer())
        .delete(endpoints.testingController.allData)
        .expect(204);
    });
    it.skip(`03 - GET -> "/sa/quiz/questions": should return status 200; content: questions array with pagination; used additional methods: POST -> /sa/quiz/questions;`, async () => {
      await quiz.createWithQuestion(
        1,
        'What is my name?',
        ['Calypso', 'Matias', 'Colombo'],
        app,
      );
      await quiz.createWithQuestion(1, 'ttt dddd  l', ['dddd', 'aaaaa', 'gggg'], app);
      const res = await quiz.createWithQuestion(
        1,
        'gggggg    aaaaa',
        ['lllll', '345234', '3241234'],
        app,
      );
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

  describe(`24`, () => {
    const quiz = new FactoryQuiz();
    const factory = new FactoryT();
    let accessToken0: string;
    let accessToken1: string;
    let user0: UsersViewType;
    let user1: UsersViewType;
    it(`00 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer())
        .delete(endpoints.testingController.allData)
        .expect(204);
    });
    it(`01 - POST -> "/sa/quiz/questions": should create new question; status 201; content: created question; used additional methods: GET => /sa/quiz/questions;`, async () => {
      await quiz.createWithQuestion(1, 'What is my name?', ['Alex', 'Sania'], app);
      await quiz.createWithQuestion(
        1,
        'How many wheels does a three axle car have?',
        ['Six', '6'],
        app,
      );
      await quiz.createWithQuestion(
        1,
        'What shape is the moon?',
        ['circle', 'oval', 'ellipse'],
        app,
      );
      await quiz.createWithQuestion(1, 'What was Jobs first name?', ['Steven', 'Paul'], app);
      await quiz.createWithQuestion(
        1,
        'How many angles are in a right triangle?',
        ['3', 'three'],
        app,
      );
      await quiz.createWithQuestion(
        1,
        'in what year was born abolished serfdom in Poland?',
        ['1984'],
        app,
      );
      await request(app.getHttpServer())
        .get(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .expect(200)
        .then(({ body }) => {
          expect(body.items).toHaveLength(6);
        });
      const res = await factory.createUniqueUserByLoginAndEmail(
        1,
        'asirius',
        'asirius@jive.com',
        app,
      );
      user0 = res[0].user;
      accessToken0 = res[0].accessToken;
      const res1 = await factory.createUniqueUserByLoginAndEmail(
        1,
        'raccoon',
        'raccoon@animal.raw',
        app,
      );
      accessToken1 = res1[0].accessToken;
      user1 = res1[0].user;
      await quiz.connection(accessToken0, app);
      await quiz.connection(accessToken1, app);
      await quiz.answer('Alex', accessToken0, app);
      await quiz.answer('alex', accessToken1, app);
      await quiz.answer('Six', accessToken0, app);
      await quiz.answer('circle', accessToken0, app);
      await quiz.answer('6', accessToken1, app);
      await quiz.answer('paul', accessToken1, app);
      await quiz.answer('Steven', accessToken0, app);
      await quiz.answer('3', accessToken0, app);
      await quiz.answer('1984', accessToken1, app);
      await quiz.answer('1984', accessToken1, app);
      // await quiz.connection(accessToken0, app);
    });
    it.skip(`02 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer())
        .delete(endpoints.testingController.allData)
        .expect(204);
    });
  });
});
