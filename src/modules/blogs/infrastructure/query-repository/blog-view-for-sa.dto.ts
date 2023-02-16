export class BlogViewForSaModel {
  public id: string;
  public name: string;
  public description: string;
  public websiteUrl: string;
  public createdAt: string;
  public isMembership: boolean;
  public blogOwnerInfo: BlogOwnerInfoType;
  public banInfo: BanInfoForBlogType;
  constructor(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
    blogOwnerInfo: BlogOwnerInfoType,
    banInfo: BanInfoForBlogType,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = createdAt;
    this.isMembership = isMembership;
    this.blogOwnerInfo = blogOwnerInfo;
    this.banInfo = banInfo;
  }
}

export class BlogOwnerInfoType {
  public userId: string;
  public userLogin: string;
  constructor(userId: string, userLogin: string) {
    this.userId = userId;
    this.userLogin = userLogin;
  }
}

export class BanInfoForBlogType {
  public isBanned: boolean;
  public banDate: string;
  constructor(isBanned: boolean, banDate: string) {
    this.isBanned = isBanned;
    this.banDate = banDate;
  }
}
