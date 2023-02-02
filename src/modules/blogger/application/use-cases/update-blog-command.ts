import { UpdateBlogDto } from '../../api/input-dtos/update-blog.dto';

export class UpdateBlogCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly blogInputModel: UpdateBlogDto,
  ) {}
}
