import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from './blog.entity';

@Entity()
export class BannedBlogUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  blogId: string;
  @Column({ type: 'uuid' })
  ownerId: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'character varying', collation: 'C' })
  login: string;
  @Column({ type: 'character varying' })
  email: string;
  @Column({ type: 'character varying' })
  createdAt: string;
  @Column('boolean', { default: false })
  isBanned: boolean;
  @Column({ default: null })
  banDate: string;
  @Column({ default: null })
  banReason: string;
  @ManyToOne(() => Blog, (u) => u.bannedUsers)
  blog: Blog;

  constructor(
    blogId: string,
    ownerId: string,
    userId: string,
    login: string,
    email: string,
    blog: Blog,
  ) {
    this.blogId = blogId;
    this.ownerId = ownerId;
    this.userId = userId;
    this.login = login;
    this.email = email;
    this.createdAt = new Date().toISOString();
    this.blog = blog;
  }

  static createBan(
    blogId: string,
    ownerId: string,
    userId: string,
    login: string,
    email: string,
    blog: Blog,
  ) {
    return new BannedBlogUser(blogId, ownerId, userId, login, email, blog);
  }

  checkStatusBan() {
    return this.isBanned;
  }

  unlockBanStatus() {
    this.isBanned = false;
    this.banReason = null;
    this.banDate = null;
  }

  banBanStatus(banReason: string) {
    this.isBanned = true;
    this.banReason = banReason;
    this.banDate = new Date().toISOString();
  }
}
