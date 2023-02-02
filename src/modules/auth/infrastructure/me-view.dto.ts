export class MeViewDto {
  public email: string;
  public login: string;
  public userId: string;
  constructor(email: string, login: string, userId: string) {
    this.email = email;
    this.login = login;
    this.userId = userId;
  }
}
