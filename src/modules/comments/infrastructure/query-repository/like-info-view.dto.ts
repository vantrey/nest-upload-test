export class LikeInfoViewModel {
  public likesCount: number;
  public dislikesCount: number;
  public myStatus: string;
  constructor(likesCount: number, dislikesCount: number, myStatus: string) {
    this.likesCount = likesCount;
    this.dislikesCount = dislikesCount;
    this.myStatus = myStatus;
  }
}
