import { UpdateBanInfoForUserDto } from '../../api/input-dtos/update-ban-info-for-user.dto';

export class UpdateBanUserForCurrentBlogCommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly banUserForCurrentBlogInputModel: UpdateBanInfoForUserDto,
  ) {}
}
