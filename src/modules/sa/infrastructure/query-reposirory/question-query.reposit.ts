import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionViewModel } from './question-View-Model';
import { Question } from '../../../../entities/question.entity';
import { PaginationViewModel } from '../../../../common/pagination-View-Model';
import { PaginationQuestionDto } from '../../api/input-dtos/pagination-Question-Dto';

@Injectable()
export class QuestionQueryRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  private mappedForQuestion(question: Question): QuestionViewModel {
    return new QuestionViewModel(
      question.id,
      question.body,
      question.correctAnswers,
      question.published,
      question.createdAt.toISOString(),
      question.updatedAt ? question.updatedAt.toISOString() : null,
    );
  }

  async findQuestion(questionId: string): Promise<QuestionViewModel> {
    const user = await this.questionRepo.findOneBy({ id: questionId });
    console.log('user', user);
    if (!user) return null;
    return this.mappedForQuestion(user);
  }

  async getQuestions(data: PaginationQuestionDto): Promise<PaginationViewModel<QuestionViewModel[]>> {
    const { bodySearchTerm, publishedStatus, pageSize, pageNumber, sortDirection, sortBy } = data;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    let filter = {};
    if (publishedStatus === 'notPublished') {
      filter = { published: false };
    }
    if (publishedStatus === 'published') {
      filter = { published: true };
    }
    if (bodySearchTerm.trim().length > 0) {
      filter = { body: ILike(`%${bodySearchTerm}%`) };
    }
    //search all blogs for current user and counting
    const [question, count] = await Promise.all([
      this.questionRepo.find({
        select: ['id', 'body', 'correctAnswers', 'published', 'createdAt', 'updatedAt'],
        where: filter,
        order: { [sortBy]: order },
        skip: data.skip,
        take: pageSize,
      }),
      this.questionRepo.count({ where: filter }),
    ]);
    //mapped for View
    const mappedBlogs = question.map((q) => this.mappedForQuestion(q));
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found Blogs with pagination!
    return new PaginationViewModel(pagesCountRes, pageNumber, pageSize, count, mappedBlogs);
  }
}
