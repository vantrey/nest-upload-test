import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { columns } from '../columns';

export class PaginationQuizTopDto {
  /**
   * SORT    Default value : ?sort=avgScores desc&sort=sumScore desc
   */
  // @OptionalArrayStrings()
  @IsOptional()
  @Transform((value) => {
    try {
      const defaultValue = ['avgScores desc', 'sumScore desc'];
      const defaultField = ['sumScore', 'avgScores', 'gamesCount', 'winsCount', 'lossesCount', 'drawsCount'];
      const defaultFieldSort = ['asc', 'desc'];
      if (typeof value.value === 'string') {
        const array = value.value.split(' ');
        if (array.length !== 2) return defaultValue;
        if (!columns[array[0]]) return defaultValue;
        if (array[1].toUpperCase() !== 'ASC' || 'DESC') {
          return value.value.split(',');
        }
        return defaultValue;
      }
      if (typeof value.value === 'object') {
        const inputValue = value.value;
        function hasIntersection(arr1, arr2, arr3) {
          let arrayKeys = [];
          let arrayValues = [];
          arr1.map((e) => {
            arrayKeys.push(e.split(' ')[0]);
            arrayValues.push(e.split(' ')[1]);
          });
          return !!(arrayKeys.every((val) => arr2.includes(val)) && arrayValues.every((value) => arr3.includes(value)));
        }
        if (hasIntersection(inputValue, defaultField, defaultFieldSort)) {
          return value.value;
        }
        return defaultValue;
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
