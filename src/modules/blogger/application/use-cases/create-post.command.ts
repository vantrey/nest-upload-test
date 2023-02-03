import { CreatePostDto } from '../../../posts/api/input-Dtos/create-post.dto';

export class CreatePostCommand {
  constructor(
    public readonly postInputModel: CreatePostDto,
    public readonly blogId: string,
    public readonly userId: string,
  ) {}
}
