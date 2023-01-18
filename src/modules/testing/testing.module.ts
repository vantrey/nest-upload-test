import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../blogger/domain/blog-schema-Model';
import { Post, PostSchema } from '../posts/domain/post-schema-Model';
import { TestingController } from './testins.controller';
import { Comment, CommentSchema } from '../comments/domain/comments-schema-Model';
import { TestingService } from './testing.service';
import { Device, DeviceSchema } from '../security/domain/device-schema-Model';
import { LikeComment, LikeCommentSchema } from '../comments/domain/likeComment-schema-Model';
import { LikePost, LikePostSchema } from '../posts/domain/likePost-schema-Model';
import {
  BlogBanInfo,
  BlogBanInfoSchema,
} from '../blogger/domain/ban-user-for-current-blog-schema-Model';
import { User } from '../../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      // { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: LikeComment.name, schema: LikeCommentSchema },
      { name: LikePost.name, schema: LikePostSchema },
      { name: BlogBanInfo.name, schema: BlogBanInfoSchema },
    ]),
    TypeOrmModule.forFeature([User]),
  ],

  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
