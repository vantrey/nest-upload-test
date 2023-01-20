import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { BlogsQueryRepositories } from '../infrastructure/query-repository/blogs-query.repositories';
import { BlogViewModel } from '../infrastructure/query-repository/blog-View-Model';
import { PaginationBlogDto } from './input-Dtos/pagination-Blog-Dto';
import { PaginationViewModel } from '../../../common/pagination-View-Model';
import { PostsQueryRepositories } from '../../posts/infrastructure/query-repositories/posts-query.reposit';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { PostViewModel } from '../../posts/infrastructure/query-repositories/post-View-Model';
import { CurrentUserId } from '../../../decorators/current-user-id.param.decorator';
import { JwtForGetGuard } from '../../../guards/jwt-auth-bearer-for-get.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller(`blogs`)
export class BlogsController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepositories,
    private readonly postsQueryRepo: PostsQueryRepositories,
  ) {}

  @Get()
  async findAll(
    @Query() paginationInputModel: PaginationBlogDto,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    return await this.blogsQueryRepo.findBlogs(paginationInputModel);
  }

  @UseGuards(JwtForGetGuard)
  @Get(`:blogId/posts`)
  async findPosts(
    @CurrentUserId() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Query() paginationInputModel: PaginationBlogDto,
  ): Promise<PaginationViewModel<PostViewModel[]>> {
    await this.blogsQueryRepo.findBlog(blogId);
    return this.postsQueryRepo.findPosts(paginationInputModel, userId, blogId);
  }

  @Get(`:id`)
  async findOne(
    @Param(`id`, ValidateUuidPipe) id: string,
  ): Promise<BlogViewModel> {
    return await this.blogsQueryRepo.findBlog(id);
  }
}
