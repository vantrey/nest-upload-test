import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';
import { Question } from './question.entity';

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
}
