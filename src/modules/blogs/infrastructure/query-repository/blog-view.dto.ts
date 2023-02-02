export class BlogViewModel {
  public id: string;
  public name: string;
  public description: string;
  public websiteUrl: string;
  public createdAt: string;
  constructor(id: string, name: string, description: string, websiteUrl: string, createdAt: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = createdAt;
  }
}
