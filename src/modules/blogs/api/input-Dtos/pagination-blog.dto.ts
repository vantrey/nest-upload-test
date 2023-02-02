import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/pagination.dto';

export class PaginationBlogDto extends PaginationDto {
  /**
   *  Search term for blog Name: Name should contain this term in any position
   */
  @IsString()
  @IsOptional()
  searchNameTerm: string = '';
}
