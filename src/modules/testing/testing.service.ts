import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../../entities/device.entity';
import { Blog } from '../../entities/blog.entity';
import { BannedBlogUser } from '../../entities/banned-blog-user.entity';
import { Post } from '../../entities/post.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async deleteAll() {
    // await this.blogsModel.deleteMany();
    // await this.postModel.deleteMany();
    // await this.userModel.deleteMany();
    // await this.commentsModel.deleteMany();
    // await this.deviceModel.deleteMany();
    // await this.likesStatusModel.deleteMany();
    // await this.likesPostsStatusModel.deleteMany();
    // await this.blogBanInfoModel.deleteMany();
    await this.userRepo.manager.connection
      .transaction(async (manager) => {
        await manager.delete(User, {});
        await manager.delete(Device, {});
        await manager.delete(Blog, {});
        await manager.delete(Post, {});
        await manager.delete(BannedBlogUser, {});
      })
      .catch((e) => {
        return console.log(e);
      });
    return;
  }
}
