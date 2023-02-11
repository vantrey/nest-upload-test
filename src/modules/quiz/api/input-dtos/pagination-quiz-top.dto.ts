import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { columns } from '../columns';
//['avgScores desc', 'sumScore desc'];

export class PaginationQuizTopDto {
  /**
   * SORT    Default value : ?sort=avgScores desc&sort=sumScore desc
   */
  // @OptionalArrayStrings()
  @IsOptional()
  @Transform((value) => {
    try {
      const defaultValue = ['avgScores desc', 'sumScore desc'];
      if (typeof value.value === 'string') {
        // console.log('typeof string');
        const array = value.value.split(' ');
        if (array.length !== 2) return defaultValue;
        if (!columns[array[0]]) return defaultValue;
        if (array[1].toUpperCase() !== 'ASC' || 'DESC') return defaultValue;
      }

      if (typeof value.value === 'object') {
        return value.value.map((e) => {
          const column = e.split(' ')[0];
          const direction = e.split(' ')[1].toUpperCase();
          if (column !== columns[column]) return defaultValue;
          if (direction !== 'ASC' || 'DESC') return defaultValue;
        });
      }
    } catch (e) {
      return ['avgScores desc', 'sumScore desc'];
    }
  })
  sort: string[] = ['avgScores desc', 'sumScore desc'];

  /**
   * pageSize is portions size that should be returned
   */
  @IsNumber()
  @IsOptional()
  pageSize?: number = 10;
  /**
   *  pageNumber is number of portions that should be returned
   */
  @IsNumber()
  @IsOptional()
  pageNumber?: number = 1;

  get skip(): number {
    return this.pageSize * (this.pageNumber - 1);
  }
}
