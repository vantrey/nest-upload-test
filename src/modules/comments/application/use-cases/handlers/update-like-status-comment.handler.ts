import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepositories } from '../../../infrastructure/comments.repositories';
import { NotFoundExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { UpdateLikeStatusCommentCommand } from '../update-like-status-comment.command';
import { LikeComment } from '../../../../../entities/like-comment.entity';

@CommandHandler(UpdateLikeStatusCommentCommand)
export class UpdateLikeStatusCommentHandler implements ICommandHandler<UpdateLikeStatusCommentCommand> {
  constructor(private readonly commentsRepo: CommentsRepositories) {}

  async execute(command: UpdateLikeStatusCommentCommand): Promise<boolean> {
    const { id, userId } = command;
    const { likeStatus } = command.updateLikeStatusInputModel;
    //finding comment by id from uri params
    const comment = await this.commentsRepo.findCommentsById(id);
    if (!comment) throw new NotFoundExceptionMY(`comment with specified id doesn't exists`);
    //finding likeComment for update like status
    const foundLikeComment = await this.commentsRepo.findLikeComment(id, userId);
    if (!foundLikeComment) {
      const newLikeComment = LikeComment.createLikeComment(userId, id, comment);
      //save
      const createdLikeComment = await this.commentsRepo.saveLikeComment(newLikeComment);
      createdLikeComment.updateLikeComment(likeStatus);
      await this.commentsRepo.saveLikeComment(createdLikeComment);
      return true;
    }
    foundLikeComment.updateLikeComment(likeStatus);
    await this.commentsRepo.saveLikeComment(foundLikeComment);
    return true;
  }
}
