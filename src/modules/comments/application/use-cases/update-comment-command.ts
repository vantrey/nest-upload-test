import { UpdateCommentDto } from '../../api/input-Dtos/update-comment.dto';

export class UpdateCommentCommand {
  constructor(
    public readonly id: string,
    public readonly updateCommentInputModel: UpdateCommentDto,
    public readonly userId: string,
  ) {}
}
