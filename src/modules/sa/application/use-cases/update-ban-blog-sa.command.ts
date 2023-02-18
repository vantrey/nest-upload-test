import { UpdateBanInfoForBlogDto } from '../../api/input-dtos/update-ban-info-for-blog.dto';

export class UpdateBanBlogSaCommand {
  constructor(public readonly updateBanInfoForBlogModel: UpdateBanInfoForBlogDto, public readonly blogId: string) {}
}
