import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

export enum LikeStatusType {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

@Entity()
export class LikePost {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('boolean', { default: false })
  isBanned: boolean;
  @Column({ type: 'character varying' })
  addedAt: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'uuid' })
  parentId: string;
  @Column({ type: 'character varying' })
  userLogin: string;
  @Column({ default: 'None' })
  likeStatus: string;
  @ManyToOne(() => User, (u) => u.likePosts)
  user: User;
  @ManyToOne(() => Post, (u) => u.likePost)
  post: Post;

  constructor(userId: string, parentId: string, login: string, post: Post, user: User) {
    this.addedAt = new Date().toISOString();
    this.userId = userId;
    this.parentId = parentId;
    this.userLogin = login;
    this.post = post;
    this.user = user;
  }

  static createLikePost(userId: string, parentId: string, login: string, post: Post, user: User) {
    return new LikePost(userId, parentId, login, post, user);
  }

  updateLikePost(likeStatus: string) {
    this.likeStatus = likeStatus;
    this.addedAt = new Date().toISOString();
  }
}
