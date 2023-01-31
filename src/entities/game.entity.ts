import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';
import { Question } from './question.entity';
import { AnswerStatusesType } from './answer.entity';

export enum GameStatusesType {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'enum',
    enum: GameStatusesType,
    default: GameStatusesType.PendingSecondPlayer,
  })
  status: GameStatusesType;

  @Column({ type: 'timestamptz', default: null })
  pairCreatedDate: Date; //Date when first player initialized the pair
  @Column({ type: 'timestamptz', default: null })
  startGameDate: Date; //Game starts immediately after second player connection to this pair
  @Column({ type: 'timestamptz', default: null })
  finishGameDate: Date; //Game finishes immediately after both players have answered all the questions

  @Column({ type: 'uuid' })
  firstPlayerId: string;
  @Column({ type: 'uuid', default: null })
  secondPlayerId: string;

  @OneToOne(() => Player, { eager: true })
  @JoinColumn()
  firstPlayerProgress: Player;

  @OneToOne(() => Player, { eager: true })
  @JoinColumn()
  secondPlayerProgress: Player;

  @ManyToMany(() => Question, (q) => q.games)
  questions: Question[];

  constructor(questions: Question[], userId: string) {
    this.questions = questions;
    this.firstPlayerId = userId;
  }

  static createGame(questions: Question[], userId: string) {
    return new Game(questions, userId);
  }

  addFirstPlayer(player: Player) {
    this.firstPlayerProgress = player;
    this.pairCreatedDate = new Date();
    this.status = GameStatusesType.PendingSecondPlayer;
  }

  addSecondPlayer(player: Player, userId: string) {
    this.secondPlayerProgress = player;
    this.startGameDate = new Date();
    this.status = GameStatusesType.Active;
    this.secondPlayerId = userId;
  }

  finishDate() {
    this.status = GameStatusesType.Finished;
    this.finishGameDate = new Date();
  }

  isPlayerFinished(userId: string) {
    //---player.answers.length === activeGame.questions.length
    if (this.firstPlayerId === userId) {
      if (this.questions.length === this.firstPlayerProgress.answers.length) return true;
    }
    if (this.secondPlayerId === userId) {
      if (this.questions.length === this.secondPlayerProgress.answers.length) return true;
    }
  }

  questionNumber(player: Player) {
    // const question = activeGame.questions[player.answers.length];
    return this.questions[player.answers.length];
  }

  checkAnswer(answer: string, question: Question) {
    if (question.correctAnswers.find((e) => e === answer)) return true;
  }

  isGameFinished() {
    if (
      this.questions.length === this.firstPlayerProgress.answers.length &&
      this.questions.length === this.secondPlayerProgress.answers.length
    )
      return true;
  }

  addBonusPoint() {
    // const answersFirstPlayer = await this.quizRepo.findAnswers(game.firstPlayerProgress.id, game.id);
    // const answersSecondPlayer = await this.quizRepo.findAnswers(game.secondPlayerProgress.id, game.id);
    // const successAnswersFirstPlayer = await this.quizRepo.countSuccessAnswers(game.firstPlayerProgress.id, game.id);
    // const successAnswersSecondPlayer = await this.quizRepo.countSuccessAnswers(game.secondPlayerProgress.id, game.id);
    // if (successAnswersFirstPlayer >= 1 && answersFirstPlayer[4].addedAt < answersSecondPlayer[4].addedAt) {
    //   const player = await this.quizRepo.findPlayer(game.firstPlayerId, game.id);
    //   player.addPoint();
    //   await this.quizRepo.savePlayer(player);
    // }
    // if (successAnswersSecondPlayer >= 1 && answersFirstPlayer[4].addedAt > answersSecondPlayer[4].addedAt) {
    //   const player = await this.quizRepo.findPlayer(game.secondPlayerId, game.id);
    //   player.addPoint();
    //   await this.quizRepo.savePlayer(player);
    // }
    const successAnswersFirstPlayer = this.firstPlayerProgress.answers.filter(
      (e) => e.answerStatus === AnswerStatusesType.Correct,
    );
    const successAnswersSecondPlayer = this.secondPlayerProgress.answers.filter(
      (e) => e.answerStatus === AnswerStatusesType.Correct,
    );
    const answersFirstPlayer = this.firstPlayerProgress.answers.sort((a, b) => Number(b.addedAt) - Number(a.addedAt));
    const answersSecondPlayer = this.secondPlayerProgress.answers.sort((a, b) => Number(b.addedAt) - Number(a.addedAt));
    if (successAnswersFirstPlayer.length >= 1 && answersFirstPlayer[4].addedAt < answersSecondPlayer[4].addedAt) {
      this.firstPlayerProgress.score += 1;
    }
    if (successAnswersSecondPlayer.length >= 1 && answersFirstPlayer[4].addedAt > answersSecondPlayer[4].addedAt) {
      this.secondPlayerProgress.score += 1;
    }
    return;
  }
}
