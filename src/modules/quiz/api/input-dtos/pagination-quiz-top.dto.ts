import { IsNumber, IsOptional } from 'class-validator';

export class PaginationQuizTopDto {
  /**
   * SORT    Default value : ?sort=avgScores desc&sort=sumScore desc
   *
   *
   * pageSize is portions size that should be returned
   */
  @IsNumber()
  @IsOptional()
  pageSize: number = 10;
  /**
   *  pageNumber is number of portions that should be returned
   */
  @IsNumber()
  @IsOptional()
  pageNumber: number = 1;

  get skip(): number {
    return this.pageSize * (this.pageNumber - 1);
  }
}
