import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Answer } from './answer.entity';

@Entity()
// @Check('"score" > 0')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'uuid' })
  gameId: string;
  @Column({ type: 'character varying', length: 10, collation: 'C' })
  login: string;
  @Column({ type: 'int', default: 0 })
  score: number;
  @Column({ type: 'int', default: 0 })
  winScore: number;
  @Column({ type: 'int', default: 0 })
  lossScore: number;
  @Column({ type: 'int', default: 0 })
  drawScore: number;
  @Column({ type: 'boolean', default: false })
  statusesPlayer: boolean;
  @OneToMany(() => Answer, (q) => q.player, { cascade: true, eager: true, onUpdate: 'CASCADE' })
  answers: Answer[];

  constructor(login: string, userId: string, gameId: string) {
    this.userId = userId;
    this.login = login;
    this.gameId = gameId;
  }

  static createPlayer(login: string, userId: string, gameId: string) {
    return new Player(login, userId, gameId);
  }

  static createAnswer(answer: string, id: string, player: Player) {
    return new Answer(answer, player.gameId, id, player.userId, player);
  }

  addPoint() {
    this.score += 1;
  }

  addWinPoint() {
    this.winScore += 1;
    this.statusesPlayer = true;
  }

  addLossPoint() {
    this.lossScore += 1;
    this.statusesPlayer = true;
  }

  addDrawPoint() {
    this.drawScore += 1;
    this.statusesPlayer = true;
  }
}
