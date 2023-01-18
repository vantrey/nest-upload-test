import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikePost, LikePostDocument } from '../domain/likePost-schema-Model';
import { ObjectId } from 'mongodb';
import { Post } from '../../../entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsRepositories {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectModel(LikePost.name)
    private readonly likePostModel: Model<LikePostDocument>,
  ) {}

  async savePost(newPost: Post): Promise<Post> {
    const post = await this.postRepo.save(newPost);
    if (!post) throw new Error('not today server all (');
    return post;
  }

  async saveLikePost(newLikePost: LikePostDocument): Promise<LikePostDocument> {
    const likePost = await newLikePost.save();
    if (!likePost) throw new Error('not today server all (');
    return likePost;
  }

  // async getPost(id: string, userId: string): Promise<PostDocument> {
  //   const result = await this.postModel.findOne({ _id: new ObjectId(id), userId: userId });
  //   if (!result) return null;
  //   return result;
  // }
  async getPost(id: string, userId: string): Promise<Post> {
    const post = await this.postRepo.findOneBy({ postId: id, userId: userId });
    if (!post) return null;
    return post;
  }

  // async deletePost(id: string, userId: string): Promise<boolean> {
  //   const result = await this.postModel.deleteOne({ _id: new ObjectId(id), userId: userId }).exec();
  //   return result.deletedCount === 1;
  // }
  async deletePost(id: string, userId: string): Promise<boolean> {
    const post = await this.postRepo.findOneBy({ postId: id, userId: userId });
    if (!post) return null;
    await this.postRepo.manager.connection
      .transaction(async (manager) => {
        await manager.delete(Post, { postId: id, userId: userId });
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
    return true;
  }

  async findPost(id: string): Promise<PostDocument> {
    const post = await this.postModel.findOne({ _id: new ObjectId(id) });
    if (!post) return null;
    return post;
  }

  async updateStatusBanPostForUser(userId: string, isBanned: boolean): Promise<boolean> {
    const result = await this.postModel.updateMany(
      { userId: userId },
      { $set: { isBanned: isBanned } },
    );
    return result.matchedCount === 1;
  }

  async updateStatusBanPostForBlogger(blogId: string, isBanned: boolean): Promise<boolean> {
    const result = await this.postModel.updateMany({ blogId }, { $set: { isBanned: isBanned } });
    return result.matchedCount === 1;
  }

  async findLikePost(id: string, userId: string): Promise<LikePostDocument> {
    return this.likePostModel.findOne({ userId: userId, parentId: id });
  }

  async updateStatusBanLikePost(userId: string, isBanned: boolean): Promise<boolean> {
    const result = await this.likePostModel.updateMany(
      { userId: userId },
      { $set: { isBanned: isBanned } },
    );
    return result.matchedCount === 1;
  }
}
