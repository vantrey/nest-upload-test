import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingController } from './testins.controller';
import { Comment, CommentSchema } from '../comments/domain/comments-schema-Model';
import { TestingService } from './testing.service';
import { LikeComment, LikeCommentSchema } from '../comments/domain/likeComment-schema-Model';
import { LikePost, LikePostSchema } from '../posts/domain/likePost-schema-Model';
import { User } from '../../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../../entities/device.entity';
import { Blog } from '../../entities/blog.entity';
import { BannedBlogUser } from '../../entities/banned-blog-user.entity';
import { Post } from '../../entities/post.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: LikeComment.name, schema: LikeCommentSchema },
      { name: LikePost.name, schema: LikePostSchema },
    ]),
    TypeOrmModule.forFeature([User, Device, Blog, Post, BannedBlogUser]),
  ],

  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
