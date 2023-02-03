import { GameStatusesType } from '../../../../entities/game.entity';
import { AnswerStatusesType } from '../../../../entities/answer.entity';

export class GameViewModel {
  public id: string;
  public firstPlayerProgress: GamePlayerProgressViewModel;
  public secondPlayerProgress: GamePlayerProgressViewModel;
  public questions: QuestionShortViewModel[];
  public status: GameStatusesType;
  public pairCreatedDate: string;
  public startGameDate: string;
  public finishGameDate: string;
  constructor(
    id: string,
    firstPlayerProgress: GamePlayerProgressViewModel,
    secondPlayerProgress: GamePlayerProgressViewModel,
    questions: QuestionShortViewModel[],
    status: GameStatusesType,
    pairCreatedDate: string,
    startGameDate: string,
    finishGameDate: string,
  ) {
    this.id = id;
    this.firstPlayerProgress = firstPlayerProgress;
    this.secondPlayerProgress = secondPlayerProgress;
    this.questions = questions;
    this.status = status;
    this.pairCreatedDate = pairCreatedDate;
    this.startGameDate = startGameDate;
    this.finishGameDate = finishGameDate;
  }
}

export class GamePlayerProgressViewModel {
  public answers: AnswerViewModel[];
  public player: PLayerViewModel;
  public score: number;
  constructor(answers: AnswerViewModel[], player: PLayerViewModel, score: number) {
    this.answers = answers;
    this.player = player;
    this.score = score;
  }
}

export class QuestionShortViewModel {
  public id: string;
  public body: string;
  constructor(id: string, body: string) {
    this.id = id;
    this.body = body;
  }
}

export class AnswerViewModel {
  public questionId: string;
  public answerStatus: AnswerStatusesType;
  public addedAt: string;
  constructor(questionId: string, answerStatus: AnswerStatusesType, addedAt: string) {
    this.questionId = questionId;
    this.answerStatus = answerStatus;
    this.addedAt = addedAt;
  }
}

export class PLayerViewModel {
  public id: string;
  public login: string;
  constructor(id: string, login: string) {
    this.id = id;
    this.login = login;
  }
}
