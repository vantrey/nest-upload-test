import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/pagination.dto';

export enum BanStatusType {
  all = 'all',
  banned = 'banned',
  notBanned = 'notBanned',
}

export class PaginationUsersDto extends PaginationDto {
  /**
   * banStatus by parameters
   */
  @IsString()
  @IsEnum(BanStatusType)
  @IsOptional()
  banStatus: BanStatusType = BanStatusType.all;
  /**
   * Search term for user Login: Login should contain this term in any position
   */
  @IsString()
  @IsOptional()
  // @ApiProperty()
  searchLoginTerm: string = '';
  /**
   *  Search term for user Email: Email should contain this term in any position
   */
  @IsString()
  @IsOptional()
  // @ApiProperty()
  searchEmailTerm: string = '';
}
