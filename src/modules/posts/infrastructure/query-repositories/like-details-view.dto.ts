export class LikeDetailsViewModel {
  public addedAt: string;
  public userId: string;
  public login: string;

  constructor(addedAt: string, userId: string, login: string) {
    this.addedAt = addedAt;
    this.userId = userId;
    this.login = login;
  }
}
