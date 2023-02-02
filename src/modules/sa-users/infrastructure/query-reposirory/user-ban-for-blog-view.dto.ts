import { BanInfoType } from './ban-info.dto';

export class UsersForBanBlogView {
  constructor(public id: string, public login: string, public banInfo: BanInfoType) {}
}
