import { BanInfoType } from './ban-info.dto';

export class UserViewModel {
  public id: string;
  public login: string;
  public email: string;
  public createdAt: string;
  public banInfo: BanInfoType;

  constructor(id: string, login: string, email: string, createdAt: string, banInfo: BanInfoType) {
    this.id = id;
    this.login = login;
    this.email = email;
    this.createdAt = createdAt;
    this.banInfo = banInfo;
  }
}
