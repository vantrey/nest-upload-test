import { Injectable } from '@nestjs/common';
import { Blog } from '../../../entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BannedBlogUser } from '../../../entities/banned-blog-user.entity';

@Injectable()
export class BlogsRepositories {
  constructor(
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>,
    @InjectRepository(BannedBlogUser)
    private readonly bannedBlogUserRepo: Repository<BannedBlogUser>,
  ) {}

  async saveBlog(blog: Blog): Promise<Blog> {
    return this.blogRepo.save(blog);
  }

  async deleteBlog(id: string, userId: string): Promise<boolean> {
    await this.blogRepo.manager.connection
      .transaction(async (manager) => {
        await manager.delete(Blog, { id: id, userId: userId });
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
    return true;
  }

  async findBlog(id: string): Promise<Blog> {
    return await this.blogRepo.findOneBy({ id: id }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  async findStatusBanBy(userId: string, blogId: string): Promise<BannedBlogUser> {
    const statusBan = await this.bannedBlogUserRepo.findOneBy({
      blogId: blogId,
      userId: userId,
    });
    if (!statusBan) return null;
    return statusBan;
  }

  async saveBanStatus(banStatus: BannedBlogUser): Promise<BannedBlogUser> {
    return await this.bannedBlogUserRepo.save(banStatus);
  }
}
