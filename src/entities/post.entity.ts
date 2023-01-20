import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Blog } from './blog.entity';
import { LikePost } from './like-post.entity';
import { Comment } from './comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  postId: string;
  @Column('boolean', { default: false })
  isBanned: boolean;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'character varying', length: 30 })
  title: string;
  @Column({ type: 'character varying', length: 100 })
  shortDescription: string;
  @Column({ type: 'character varying', length: 1000 })
  content: string;
  @Column({ type: 'uuid' })
  blogId: string;
  // @Column({ type: 'character varying' })
  // blogName: string;
  @Column({ type: 'character varying' })
  createdAt: string;
  @ManyToOne(() => User, (u) => u.posts)
  user: User;
  @ManyToOne(() => Blog, (u) => u.posts)
  blog: Blog;
  @OneToMany(() => Comment, (u) => u.post)
  comments: Comment[];
  @OneToMany(() => LikePost, (u) => u.post)
  likePost: LikePost[];

  constructor(
    userId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    // blogName: string,
    blog: Blog,
  ) {
    this.userId = userId;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    // this.blogName = blogName;
    this.createdAt = new Date().toISOString();
    this.blog = blog;
  }

  static createPost(
    userId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    // blogName: string,
    blog: Blog,
  ) {
    if (
      title.length > 30 &&
      shortDescription.length > 100 &&
      content.length > 1000
    ) {
      throw new Error('Incorrect input data for create User');
    }
    return new Post(userId, title, shortDescription, content, blogId, blog);
  }

  updatePost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ) {
    if (
      title.length < 30 &&
      shortDescription.length < 100 &&
      content.length < 1000
    ) {
      this.title = title;
      this.shortDescription = shortDescription;
      this.content = content;
      this.blogId = blogId;
    } else {
      throw new Error('Incorrect input data for update post');
    }
  }

  getOwnerPost() {
    return this.userId;
  }
}
