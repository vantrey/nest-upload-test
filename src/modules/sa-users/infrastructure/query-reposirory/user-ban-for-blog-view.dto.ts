import { BanInfoType } from './ban-info.dto';

export class UsersForBanBlogView {
  public id: string;
  public login: string;
  public banInfo: BanInfoType;
  constructor(id: string, login: string, banInfo: BanInfoType) {
    this.id = id;
    this.login = login;
    this.banInfo = banInfo;
  }
}
