import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'character varying', length: 500, collation: 'C' })
  body: string;
  @Column('json', { default: [] })
  correctAnswers: string[];
  @Column({ type: 'boolean', default: false })
  published: boolean;
  @Column({ type: 'timestamptz' })
  createdAt: Date;
  @Column({ type: 'text', default: null })
  updatedAt: string;

  constructor(body: string, correctAnswers: string[]) {
    this.body = body;
    this.correctAnswers = correctAnswers;
    this.createdAt = new Date();
  }

  static createQuestion(body: string, correctAnswers: string[]) {
    correctAnswers.forEach((record) => {
      if (typeof record.trim() !== 'string' || record.trim().length === 0) {
        throw new Error('Incorrect input data for create question');
      }
    });
    if (body.length < 10 && body.length > 500) {
      throw new Error('Incorrect input data for create User');
    }
    return new Question(body, correctAnswers);
  }

  updateValue(body: string, correctAnswers: string[]) {
    this.body = body;
    this.correctAnswers = correctAnswers;
    this.updatedAt = new Date().toISOString();
  }

  publisher(published: boolean) {
    this.published = published;
  }
}
