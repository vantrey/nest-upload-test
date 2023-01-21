import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { LikeComment } from './like-comment.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('boolean', { default: false })
  isBanned: boolean;
  @Column({ type: 'uuid' })
  postId: string;
  @Column({ type: 'uuid' })
  ownerId: string;
  @Column({ type: 'character varying', length: 300 })
  content: string;
  @Column({ type: 'uuid' })
  userId: string;
  // @Column({ type: 'character varying' })
  // userLogin: string;
  @Column({ type: 'character varying' })
  createdAt: string;
  @ManyToOne(() => User, (u) => u.comments)
  user: User;
  @ManyToOne(() => Post, (u) => u.comments)
  post: Post;
  @OneToMany(() => LikeComment, (u) => u.comment)
  likesComment: Relation<LikeComment[]>;

  constructor(
    postId: string,
    ownerId: string,
    content: string,
    userId: string,
    // login: string,
    post: Post,
    user: User,
  ) {
    this.postId = postId;
    this.ownerId = ownerId;
    this.content = content;
    this.userId = userId;
    // this.userLogin = login;
    this.createdAt = new Date().toISOString();
    this.post = post;
    this.user = user;
  }

  static createComment(
    postId: string,
    ownerId: string,
    content: string,
    userId: string,
    // login: string,
    post: Post,
    user: User,
  ) {
    if (content.length < 300 && content.length > 20) {
      return new Comment(postId, ownerId, content, userId, post, user);
    }
    throw new Error('Incorrect input data for create comment');
  }

  checkOwner(userId: string) {
    return this.userId === userId; //throw new Error("Not owner Comment");
  }

  updateComment(content: string) {
    this.content = content;
  }
}
