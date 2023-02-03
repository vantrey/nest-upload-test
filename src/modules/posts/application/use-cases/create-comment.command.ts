import { CreateCommentDto } from '../../api/input-Dtos/create-comment.dto';

export class CreateCommentCommand {
  constructor(
    public readonly id: string,
    public readonly inputCommentModel: CreateCommentDto,
    public readonly userId: string,
  ) {}
}
