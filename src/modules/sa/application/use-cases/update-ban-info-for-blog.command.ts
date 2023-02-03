import { UpdateBanInfoForBlogDto } from '../../api/input-dtos/update-ban-info-for-blog.dto';

export class UpdateBanInfoForBlogCommand {
  constructor(public readonly updateBanInfoForBlogModel: UpdateBanInfoForBlogDto, public readonly blogId: string) {}
}
