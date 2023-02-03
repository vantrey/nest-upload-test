export class QuestionForSaViewModel {
  public id: string;
  public body: string;
  public correctAnswers: string[];
  public published: boolean;
  public createdAt: string;
  public updatedAt: string;
  constructor(id: string, body: string, correctAnswers: string[], published: boolean, createdAt: string, updatedAt: string) {
    this.id = id;
    this.body = body;
    this.correctAnswers = correctAnswers;
    this.published = published;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class QuestionViewModel {
  public id: string;
  public body: string;
  constructor(id: string, body: string) {
    this.id = id;
    this.body = body;
  }
}
