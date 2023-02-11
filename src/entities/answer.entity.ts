import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';

export enum AnswerStatusesType {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'character varying', collation: 'C' })
  answer: string;
  @Column({ type: 'uuid' })
  gameId: string;
  @Column({ type: 'uuid' })
  questionId: string;
  @Column({ type: 'uuid' })
  playerId: string;
  @Column({
    type: 'enum',
    enum: AnswerStatusesType,
    default: AnswerStatusesType.Incorrect,
  })
  answerStatus: AnswerStatusesType;
  @Column({ type: 'timestamptz' })
  addedAt: Date;
  @ManyToOne(() => Player, (q) => q.answers)
  player: Player;

  constructor(answer: string, gameId: string, questionId: string, playerId: string, player: Player) {
    this.answer = answer;
    this.gameId = gameId;
    this.questionId = questionId;
    this.playerId = playerId;
    this.player = player;
    this.addedAt = new Date();
  }

  static createAnswer(answer: string, gameId: string, questionId: string, playerId: string, player: Player) {
    return new Answer(answer, gameId, questionId, playerId, player);
  }

  correctAnswer() {
    this.answerStatus = AnswerStatusesType.Correct;
    this.addedAt = new Date();
  }

  inCorrectAnswer() {
    this.answerStatus = AnswerStatusesType.Incorrect;
    this.addedAt = new Date();
  }

  incorrectAnswer() {
    this.addedAt = new Date();
  }
}
