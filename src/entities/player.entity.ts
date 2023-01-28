import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Answer } from './answer.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string; //userId
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'uuid' })
  gameId: string;
  @Column({ type: 'character varying', length: 10, collation: 'C' })
  login: string;
  @Column({ type: 'int', default: 0 })
  score: number;
  @Column({ type: 'boolean', default: false })
  statusesPlayer: boolean;
  @OneToMany(() => Answer, (q) => q.player, { eager: true })
  answers: Answer[];

  constructor(login: string, userId: string, gameId: string) {
    this.userId = userId;
    this.login = login;
    this.gameId = gameId;
  }

  static createPlayer(login: string, userId: string, gameId: string) {
    return new Player(login, userId, gameId);
  }

  addPoint() {
    this.score += 1;
  }
  changeStatuses() {
    this.statusesPlayer = true;
  }
}
