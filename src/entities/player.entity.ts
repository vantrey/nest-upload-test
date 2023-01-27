import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Answer } from './answer.entity';
import { Game, GameStatusesType } from './game.entity';

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
  @Column({ type: 'boolean', default: false })
  statusesPlayer: boolean;
  @OneToMany(() => Answer, (q) => q.player, { eager: true })
  answers: Answer[];
  @OneToOne(() => Game)
  // @JoinColumn()
  game: Game;

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
  changeStatuses() {
    this.statusesPlayer = true;
  }

  addBonusPoint() {
    this.score += 2;
  }
}
