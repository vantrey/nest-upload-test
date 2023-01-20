import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/pagination-dto';

export class PaginationUsersByLoginDto extends PaginationDto {
  /**
   * Search term for user Login: Login should contain this term in any position
   */
  @IsString()
  @IsOptional()
  searchLoginTerm: string = '';
}
