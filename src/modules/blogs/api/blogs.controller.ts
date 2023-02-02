import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { BlogsQueryRepositories } from '../infrastructure/query-repository/blogs-query.repositories';
import { PaginationBlogDto } from './input-Dtos/pagination-blog.dto';
import { PaginationViewDto } from '../../../common/pagination-View.dto';
import { PostsQueryRepositories } from '../../posts/infrastructure/query-repositories/posts-query.reposit';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { PostViewDto } from '../../posts/infrastructure/query-repositories/post-view.dto';
import { CurrentUserId } from '../../../decorators/current-user-id.param.decorator';
import { JwtForGetGuard } from '../../../guards/jwt-auth-bearer-for-get.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { BlogViewModel } from '../infrastructure/query-repository/blog-view.dto';

@ApiTags('Blogs')
@SkipThrottle()
@Controller(`blogs`)
export class BlogsController {
  constructor(private readonly blogsQueryRepo: BlogsQueryRepositories, private readonly postsQueryRepo: PostsQueryRepositories) {}

  @Get()
  async findAll(@Query() paginationInputModel: PaginationBlogDto): Promise<PaginationViewDto<BlogViewModel[]>> {
    return await this.blogsQueryRepo.findBlogs(paginationInputModel);
  }

  @UseGuards(JwtForGetGuard)
  @Get(`:blogId/posts`)
  async findPosts(
    @CurrentUserId() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Query() paginationInputModel: PaginationBlogDto,
  ): Promise<PaginationViewDto<PostViewDto[]>> {
    await this.blogsQueryRepo.findBlog(blogId);
    return this.postsQueryRepo.findPosts(paginationInputModel, userId, blogId);
  }

  @Get(`:id`)
  async findOne(@Param(`id`, ValidateUuidPipe) id: string): Promise<BlogViewModel> {
    return await this.blogsQueryRepo.findBlog(id);
  }
}
