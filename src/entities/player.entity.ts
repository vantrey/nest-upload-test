import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Answer } from './answer.entity';

@Entity()
export class Player {
  @PrimaryColumn('uuid')
  id: string; //userId
  @Column({ type: 'uuid' })
  gameId: string;
  @Column({ type: 'character varying', length: 10, collation: 'C' })
  login: string;
  @Column({ type: 'int', default: 0 })
  score: number;
  @OneToMany(() => Answer, (q) => q.player, { eager: true })
  answers: Answer[];

  constructor(login: string, userId: string, gameId: string) {
    this.id = userId;
    this.login = login;
    this.gameId = gameId;
  }

  static createPlayer(login: string, userId: string, gameId: string) {
    return new Player(login, userId, gameId);
  }

  addPoint() {
    this.score += 1;
  }

  addBonusPoint() {
    this.score += 2;
  }
}
