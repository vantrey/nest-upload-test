import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity()
export class LikeComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('boolean', { default: false })
  isBanned: boolean;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'uuid' })
  parentId: string;
  @Column({ default: 'None' })
  likeStatus: string;
  @ManyToOne(() => User, (u) => u.likeComments)
  user: User;
  @ManyToOne(() => Comment, (u) => u.likesComment)
  comment: Comment;

  constructor(userId: string, parentId: string, comment: Comment) {
    this.userId = userId;
    this.parentId = parentId;
    this.comment = comment;
  }

  static createLikeComment(userId: string, parentId: string, comment: Comment) {
    return new LikeComment(userId, parentId, comment);
  }

  updateLikeComment(likeStatus: string) {
    this.likeStatus = likeStatus;
  }
}
