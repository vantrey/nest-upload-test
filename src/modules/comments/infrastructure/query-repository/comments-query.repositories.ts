import { Injectable } from '@nestjs/common';
import { CommentsViewType, LikesInfoViewModel } from './comments-View-Model';
import { NotFoundExceptionMY } from '../../../../helpers/My-HttpExceptionFilter';
import { Comment } from '../../../../entities/comment.entity';
import { LikeStatusType } from '../../../../entities/like-post.entity';
import { LikeComment } from '../../../../entities/like-comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsQueryRepositories {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(LikeComment)
    private readonly likeCommentRepo: Repository<LikeComment>,
  ) {}

  async getComment(commentId: string, userId: string | null): Promise<CommentsViewType> {
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likeCommentRepo.findOneBy({
        userId: userId,
        parentId: commentId,
      });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const [comment, countLike, countDislike] = await Promise.all([
      this.commentRepo.findOne({
        select: ['commentId', 'content', 'userId', 'createdAt'],
        relations: { user: true },
        where: { commentId: commentId, isBanned: false },
      }),
      this.likeCommentRepo.count({
        where: { parentId: commentId, likeStatus: 'Like', isBanned: false },
      }),
      this.likeCommentRepo.count({
        where: { parentId: commentId, likeStatus: 'Dislike', isBanned: false },
      }),
    ]);
    //search comment
    if (!comment) throw new NotFoundExceptionMY(`Not found for commentId: ${commentId}`);
    const likesInfo = new LikesInfoViewModel(countLike, countDislike, myStatus);
    //returning comment for View
    return new CommentsViewType(comment.commentId, comment.content, comment.userId, comment.user.login, comment.createdAt, likesInfo);
  }
}
