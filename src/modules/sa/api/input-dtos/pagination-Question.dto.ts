import { IsOptional } from 'class-validator';
import { PaginationDto } from '../../../../common/pagination.dto';

export enum PublishedStatusType {
  all = 'all',
  published = 'published',
  notPublished = 'notPublished',
}

export class PaginationQuestionDto extends PaginationDto {
  /**
   * banStatus by parameters
   */
  @IsOptional()
  publishedStatus?: PublishedStatusType = PublishedStatusType.all;
  /**
   * Search term for body
   */
  @IsOptional()
  bodySearchTerm?: string = '';

  isSorByDefault() {
    const defaultValue = ['id', 'body', 'correctAnswers', 'published', 'createdAt', 'updatedAt'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'createdAt');
  }

  getPublishedStatus() {
    const defaultValue = ['all', 'published', 'notPublished'];
    return (this.publishedStatus = defaultValue.includes(this.publishedStatus) ? this.publishedStatus : PublishedStatusType.all);
  }
}
