import { Injectable } from '@nestjs/common';
import { Post } from '../../../entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LikePost } from '../../../entities/like-post.entity';
import { Comment } from '../../../entities/comment.entity';
import { LikeComment } from '../../../entities/like-comment.entity';

@Injectable()
export class PostsRepositories {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(LikePost) private readonly likePostRepo: Repository<LikePost>,
  ) {}

  async savePost(newPost: Post): Promise<Post> {
    const post = await this.postRepo.save(newPost);
    if (!post) throw new Error('not today server all (');
    return post;
  }

  async saveLikePost(newLikePost: LikePost): Promise<LikePost> {
    return this.likePostRepo.save(newLikePost);
  }

  async getPost(id: string, userId: string): Promise<Post> {
    const post = await this.postRepo.findOneBy({ id: id, userId: userId });
    if (!post) return null;
    return post;
  }

  async deletePost(id: string, userId: string): Promise<boolean> {
    const post = await this.postRepo.findOneBy({ id: id, userId: userId });
    if (!post) return null;
    await this.postRepo.manager.connection
      .transaction(async (manager) => {
        await manager.delete(Post, { id: id, userId: userId });
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
    return true;
  }

  async findPost(id: string): Promise<Post> {
    const post = await this.postRepo.findOneBy({ id: id });
    if (!post) return null;
    return post;
  }

  async updateStatusBanContentsUser(userId: string, isBanned: boolean): Promise<boolean> {
    await this.postRepo.manager.connection
      .transaction(async (manager) => {
        await manager.update(Post, { userId: userId }, { isBanned: isBanned });
        await manager.update(LikePost, { userId: userId }, { isBanned: isBanned });
        await manager.update(Comment, { userId: userId }, { isBanned: isBanned });
        await manager.update(LikeComment, { userId: userId }, { isBanned: isBanned });
      })
      .catch((e) => {
        console.log(e);
        return null;
      });
    return true;
  }

  async updateStatusBanPostForBlogger(blogId: string, isBanned: boolean): Promise<boolean> {
    await this.postRepo.manager.connection
      .transaction(async (manager) => {
        await manager.update(Post, { blogId: blogId }, { isBanned: isBanned });
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
    return true;
  }

  async findLikePost(id: string, userId: string): Promise<LikePost> {
    return this.likePostRepo.findOneBy({ userId: userId, parentId: id });
  }
}
