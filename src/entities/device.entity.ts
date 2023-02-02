import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Device {
  @PrimaryColumn({ type: 'uuid' })
  deviceId: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'character varying' })
  ip: string;
  @Column({ type: 'character varying' })
  title: string;
  @Column({ type: 'character varying' })
  lastActiveDate: string;
  @Column({ type: 'character varying' })
  expiredDate: string;
  @ManyToOne(() => User, (u) => u.device)
  user: User;

  constructor(
    userId: string,
    ip: string,
    title: string,
    lastActiveDate: string,
    expiredDate: string,
    deviceId: string,
    user: User,
  ) {
    this.userId = userId;
    this.ip = ip;
    this.title = title;
    // this.lastActiveDate = new Date(lastActiveDate * 1000).toISOString();
    // this.expiredDate = new Date(expiredDate * 1000).toISOString();
    this.lastActiveDate = lastActiveDate;
    this.expiredDate = expiredDate;
    this.deviceId = deviceId;
    this.user = user;
  }

  static createDevice(
    userId: string,
    ip: string,
    title: string,
    lastActiveDate: string,
    expiredDate: string,
    deviceId: string,
    user: User,
  ) {
    return new Device(userId, ip, title, lastActiveDate, expiredDate, deviceId, user);
  }

  updateDateDevice(dateCreateToken: string, dateExpiredToken: string) {
    this.lastActiveDate = dateCreateToken;
    this.expiredDate = dateExpiredToken;
  }
}
