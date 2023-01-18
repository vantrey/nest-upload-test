import { Module } from '@nestjs/common';
import { TestingController } from './testins.controller';
import { TestingService } from './testing.service';
import { User } from '../../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../../entities/device.entity';
import { Blog } from '../../entities/blog.entity';
import { BannedBlogUser } from '../../entities/banned-blog-user.entity';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';
import { LikePost } from '../../entities/like-post.entity';
import { LikeComment } from '../../entities/like-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Device, Blog, Post, Comment, LikePost, LikeComment, BannedBlogUser])],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
