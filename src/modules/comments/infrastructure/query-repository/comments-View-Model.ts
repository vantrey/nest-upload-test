import { LikeInfoViewModel } from './like-info-view.dto';

export class BloggerCommentsViewType {
  constructor(
    public id: string,
    public content: string,
    public createdAt: string,
    public likesInfo: LikeInfoViewModel,
    public commentatorInfo: CommentatorInfoModel,
    public postInfo: PostInfoModel,
  ) {}
}

export class CommentatorInfoModel {
  constructor(public userId: string, public userLogin: string) {}
}

export class PostInfoModel {
  constructor(public id: string, public title: string, public blogId: string, public blogName: string) {}
}
