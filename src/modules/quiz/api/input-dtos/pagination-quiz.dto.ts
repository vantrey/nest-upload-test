import { PaginationDto } from '../../../../common/pagination.dto';

export class PaginationQuizDto extends PaginationDto {
  isSorByDefault() {
    const defaultValue = ['id', 'status', 'pairCreatedDate', 'startGameDate', 'finishGameDate'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'pairCreatedDate');
  }
}
