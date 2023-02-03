import { LikeInfoViewModel } from './like-info-view.dto';

export class BloggerCommentsViewModel {
  public id: string;
  public content: string;
  public createdAt: string;
  public likesInfo: LikeInfoViewModel;
  public commentatorInfo: CommentatorInfoModel;
  public postInfo: PostInfoModel;
  constructor(
    id: string,
    content: string,
    createdAt: string,
    likesInfo: LikeInfoViewModel,
    commentatorInfo: CommentatorInfoModel,
    postInfo: PostInfoModel,
  ) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.likesInfo = likesInfo;
    this.commentatorInfo = commentatorInfo;
    this.postInfo = postInfo;
  }
}

export class CommentatorInfoModel {
  public userId: string;
  public userLogin: string;
  constructor(userId: string, userLogin: string) {
    this.userId = userId;
    this.userLogin = userLogin;
  }
}

export class PostInfoModel {
  public id: string;
  public title: string;
  public blogId: string;
  public blogName: string;
  constructor(id: string, title: string, blogId: string, blogName: string) {
    this.id = id;
    this.title = title;
    this.blogId = blogId;
    this.blogName = blogName;
  }
}
