export class BanInfoType {
  public isBanned: boolean;
  public banDate: string;
  public banReason: string;

  constructor(isBanned: boolean, banDate: string, banReason: string) {
    this.isBanned = isBanned;
    this.banDate = banDate;
    this.banReason = banReason;
  }
}
