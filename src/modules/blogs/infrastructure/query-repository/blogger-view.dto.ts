import { BlogImagesViewModel } from '../../../blogger/infrastructure/blog-images-view.dto';

export class BloggerViewModel {
  public id: string;
  public name: string;
  public description: string;
  public websiteUrl: string;
  public createdAt: string;
  public isMembership: boolean;
  public images: BlogImagesViewModel;
  // public subscribersCount: number;
  constructor(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
    images: BlogImagesViewModel,
    // subscribersCount: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = createdAt;
    this.isMembership = isMembership;
    this.images = images;
    // this.subscribersCount = subscribersCount;
  }
}
