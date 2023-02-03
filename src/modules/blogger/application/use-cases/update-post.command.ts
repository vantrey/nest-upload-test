import { CreatePostDto } from '../../../posts/api/input-Dtos/create-post.dto';

export class UpdatePostCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly postId: string,
    public readonly postInputModel: CreatePostDto,
  ) {}
}
