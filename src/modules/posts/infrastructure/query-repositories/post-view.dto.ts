import { ExtendedLikesInfoViewModel } from './likes-Info-view.dto';

export class PostViewModel {
  public id: string;
  public title: string;
  public shortDescription: string;
  public content: string;
  public blogId: string;
  public blogName: string;
  public createdAt: string;
  public extendedLikesInfo: ExtendedLikesInfoViewModel;
  constructor(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfoViewModel,
  ) {
    this.id = id;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogId;
    this.createdAt = createdAt;
    this.extendedLikesInfo = extendedLikesInfo;
  }
}
