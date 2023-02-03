import { LikeInfoViewModel } from './like-info-view.dto';

export class CommentViewType {
  public id: string;
  public content: string;
  public userId: string;
  public userLogin: string;
  public createdAt: string;
  public likesInfo: LikeInfoViewModel;
  constructor(id: string, content: string, userId: string, userLogin: string, createdAt: string, likesInfo: LikeInfoViewModel) {
    this.id = id;
    this.content = content;
    this.userId = userId;
    this.userLogin = userLogin;
    this.createdAt = createdAt;
    this.likesInfo = likesInfo;
  }
}
