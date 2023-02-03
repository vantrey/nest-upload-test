import { CreateBlogDto } from '../../api/input-dtos/create-blog.dto';

export class CreateBlogCommand {
  constructor(public readonly userId: string, public readonly blogInputModel: CreateBlogDto) {}
}
