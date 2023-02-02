import { LikeDetailsViewModel } from './like-details-view.dto';

export class ExtendedLikesInfoViewModel {
  public likesCount: number;
  public dislikesCount: number;
  public myStatus: string;
  public newestLikes: Array<LikeDetailsViewModel>;
  constructor(likesCount: number, dislikesCount: number, myStatus: string, newestLikes: Array<LikeDetailsViewModel>) {
    this.likesCount = likesCount;
    this.dislikesCount = dislikesCount;
    this.myStatus = myStatus;
    this.newestLikes = newestLikes;
  }
}
