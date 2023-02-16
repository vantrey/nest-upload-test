import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Blog } from './blog.entity';
import { LikePost } from './like-post.entity';
import { Comment } from './comment.entity';
import { ImagePost } from './imagePost.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;
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
  @Column({ type: 'character varying' })
  blogName: string;
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

  @OneToOne(() => ImagePost, (i) => i.post, { cascade: true, onUpdate: 'CASCADE' })
  @JoinColumn()
  image: ImagePost;

  constructor(
    userId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    blog: Blog,
  ) {
    this.userId = userId;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
    this.createdAt = new Date().toISOString();
    this.blog = blog;
  }

  static createPost(
    userId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    blog: Blog,
  ) {
    if (title.length > 30 && shortDescription.length > 100 && content.length > 1000) {
      throw new Error('Incorrect input data for create User');
    }
    return new Post(userId, title, shortDescription, content, blogId, blogName, blog);
  }

  updatePost(title: string, shortDescription: string, content: string, blogId: string) {
    if (title.length < 30 && shortDescription.length < 100 && content.length < 1000) {
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

  async setImageMain(
    urlImageMain: { key: string; fieldId: string },
    urlMiddleImageMain: { key: string; fieldId: string },
    urlSmallImageMain: { key: string; fieldId: string },
    photo: Buffer,
    middlePhoto: Buffer,
    smallPhoto: Buffer,
  ) {
    if (this.image === null) {
      const instanceImage = ImagePost.createImagePost(this.userId, this.id);

      this.image = await instanceImage.setImageMain(
        urlImageMain,
        urlMiddleImageMain,
        urlSmallImageMain,
        photo,
        middlePhoto,
        smallPhoto,
      );
      return;
    }
    await this.image.setImageMain(urlImageMain, urlMiddleImageMain, urlSmallImageMain, photo, middlePhoto, smallPhoto);
    return;
  }
}
