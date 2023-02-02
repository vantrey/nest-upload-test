import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { IsUuidCustom } from '../../../../helpers/decorator-IsUuid';
import { Trim } from '../../../../helpers/decorator-trim';

export class UpdateBanInfoForUserDto {
  /**
   * isBanned: User
   */
  @IsBoolean()
  @IsOptional()
  isBanned = true;
  /**
   * password: password User
   */
  @Trim()
  @Length(20)
  @IsString()
  banReason: string;
  /**
   * id for Blog
   */
  @Trim()
  @IsNotEmpty()
  @IsUuidCustom()
  @IsString()
  blogId: string;
}
