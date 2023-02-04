import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';
import { Question } from './question.entity';
import { AnswerStatusesType } from './answer.entity';
import { ForbiddenExceptionMY } from '../helpers/My-HttpExceptionFilter';

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

  finishGame() {
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

  numberQuestion(player: Player) {
    // const question = activeGame.questions[player.answers.length];
    return this.questions[player.answers.length];
  }

  isAnswerCorrect(answer: string, question: Question) {
    if (question.correctAnswers.find((e) => e === answer)) return true;
  }

  isGameFinished() {
    if (
      this.questions.length === this.firstPlayerProgress.answers.length &&
      this.questions.length === this.secondPlayerProgress.answers.length
    )
      return true;
  }

  addBonusPoint(firstPlayer: Player, secondPlayer: Player): Player {
    const successAnswersFirstPlayer = this.firstPlayerProgress.answers.filter(
      (e) => e.answerStatus === AnswerStatusesType.Correct,
    );
    const successAnswersSecondPlayer = this.secondPlayerProgress.answers.filter(
      (e) => e.answerStatus === AnswerStatusesType.Correct,
    );
    const answersFirstPlayer = this.firstPlayerProgress.answers.sort((a, b) => Number(a.addedAt) - Number(b.addedAt));
    const answersSecondPlayer = this.secondPlayerProgress.answers.sort((a, b) => Number(a.addedAt) - Number(b.addedAt));
    if (successAnswersFirstPlayer.length >= 1 && answersFirstPlayer[4].addedAt < answersSecondPlayer[4].addedAt) {
      // this.firstPlayerProgress.score += 1;
      firstPlayer.addPoint();
      return firstPlayer;
    }
    if (successAnswersSecondPlayer.length >= 1 && answersFirstPlayer[4].addedAt > answersSecondPlayer[4].addedAt) {
      // this.secondPlayerProgress.score += 1;
      secondPlayer.addPoint();
      return secondPlayer;
    }
    return;
  }

  isPlayerParticipate(userId: string) {
    if (this.firstPlayerId !== userId && this.secondPlayerId !== userId) return true;
  }

  firstStageGame(userId: string, answer: string, player: Player) {
    if (this.isPlayerFinished(userId)) throw new ForbiddenExceptionMY('Current user is already participating in active pair');
    if (this.firstPlayerId === userId) {
      const numberQuestionFirstPlayer = this.questions[this.firstPlayerProgress.answers.length];
      if (!this.isAnswerCorrect(answer, numberQuestionFirstPlayer)) {
        const instanceAnswer = Player.createAnswer(answer, numberQuestionFirstPlayer.id, player);
        return { instanceAnswer, player };
      }
      player.addPoint();
      const instanceAnswer = Player.createAnswer(answer, numberQuestionFirstPlayer.id, player);
      instanceAnswer.correctAnswer();
      return { instanceAnswer, player };
    }
    if (this.secondPlayerId === userId) {
      const numberQuestionSecondPlayer = this.questions[this.secondPlayerProgress.answers.length];
      if (!this.isAnswerCorrect(answer, numberQuestionSecondPlayer)) {
        const instanceAnswer = Player.createAnswer(answer, numberQuestionSecondPlayer.id, player);
        return { instanceAnswer, player };
      }
      player.addPoint();
      const instanceAnswer = Player.createAnswer(answer, numberQuestionSecondPlayer.id, player);
      instanceAnswer.correctAnswer();
      return { instanceAnswer, player };
    }
  }
}
