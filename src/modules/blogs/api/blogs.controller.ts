import { Controller, Get, Query, Param, UseGuards, Post, Delete, HttpCode } from '@nestjs/common';
import { BlogsQueryRepositories } from '../infrastructure/query-repository/blogs-query.repositories';
import { PaginationBlogDto } from '../../blogger/api/input-dtos/pagination-blog.dto';
import { PaginationViewDto } from '../../../common/pagination-View.dto';
import { PostsQueryRepositories } from '../../posts/infrastructure/query-repositories/posts-query.reposit';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { PostViewModel } from '../../posts/infrastructure/query-repositories/post-view.dto';
import { CurrentUserId, CurrentUserIdBlogger } from '../../../decorators/current-user-id.param.decorator';
import { JwtForGetGuard } from '../../../guards/jwt-auth-bearer-for-get.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogViewModel } from '../infrastructure/query-repository/blog-view.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';
import { CommandBus } from '@nestjs/cqrs';
import { SubscriptionToBlogCommand } from '../application/use-cases/subscription-to-blog.command';
import { UnsubscriptionToBlogCommand } from '../application/use-cases/unsubscription-to-blog.command';
import { JwtAuthGuard } from '../../../guards/jwt-auth-bearer.guard';
import { PaginationPostDto } from '../../posts/api/input-Dtos/pagination-post.dto';

@ApiTags('Blogs')
@SkipThrottle()
@Controller(`blogs`)
export class BlogsController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepositories,
    private readonly postsQueryRepo: PostsQueryRepositories,
    private commandBus: CommandBus,
  ) {}

  // @ApiTags('Subscription')
  @ApiOperation({ summary: 'Subscribe user to blog. Notifications about new posts will be send to Telegram Bot' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post(`:blogId/subscription`)
  async subscription(@CurrentUserIdBlogger() userId: string, @Param(`blogId`, ValidateUuidPipe) blogId: string) {
    return await this.commandBus.execute(new SubscriptionToBlogCommand(blogId, userId));
  }

  // @ApiTags('Subscription')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Unsubscribe user from blog. Notifications about new posts will not be send to Telegram Bot' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @ApiBasicAuth()
  @HttpCode(204)
  @Delete(`:blogId/subscription`)
  async unSubscription(@CurrentUserIdBlogger() userId: string, @Param(`blogId`, ValidateUuidPipe) blogId: string) {
    return await this.commandBus.execute(new UnsubscriptionToBlogCommand(blogId, userId));
  }

  @ApiOperation({ summary: 'Returns blogs with pagination' })
  @ApiOkResponsePaginated(BlogViewModel)
  @ApiResponse({ status: 200, description: 'success', type: BlogViewModel })
  @UseGuards(JwtForGetGuard)
  @Get()
  async findBlogs(
    @CurrentUserId() userId: string,
    @Query() paginationInputModel: PaginationBlogDto,
  ): Promise<PaginationViewDto<BlogViewModel>> {
    return await this.blogsQueryRepo.findBlogs(paginationInputModel, userId);
  }

  @ApiOperation({ summary: 'Returns all posts for specified blog with pagination' })
  @ApiOkResponsePaginated(PostViewModel)
  @ApiResponse({ status: 200, description: 'success', type: PostViewModel })
  @UseGuards(JwtForGetGuard)
  @Get(`:blogId/posts`)
  async findPosts(
    @CurrentUserId() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Query() paginationInputModel: PaginationPostDto,
  ): Promise<PaginationViewDto<PostViewModel>> {
    await this.blogsQueryRepo.findBlog(blogId, userId);
    return this.postsQueryRepo.findPosts(paginationInputModel, userId, blogId);
  }

  @ApiOperation({ summary: 'Returns blog by id' })
  @ApiResponse({ status: 200, description: 'success', type: BlogViewModel })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @UseGuards(JwtForGetGuard)
  @Get(`:id`)
  async findOne(@CurrentUserId() userId: string, @Param(`id`, ValidateUuidPipe) id: string): Promise<BlogViewModel> {
    return await this.blogsQueryRepo.findBlog(id, userId);
  }
}

/*
 @Get('/photo/ph')
 async getPhoto() {
   return await readTextFileAsync(path.join('views', 'photo.html'));
 }

//test points ---------------------------------------------
 @Get('/photo/delete')
 async deletePhoto() {
   const userId = '77777';
   const key = `main/${userId}.png`;
   return await this.s3.delete(userId, key);
 }

 @Post('photo/save')
 @UseInterceptors(FileInterceptor('photo'))
 @ApiConsumes('multipart/form-data')
 @ApiBody({
   schema: {
     type: 'object',
     properties: {
       photo: {
         type: 'string',
         format: 'binary',
       },
     },
   },
 })
 @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
 async createPhoto(@UploadedFile() photoFile: Express.Multer.File) {
   const userId = '77777';
   const key = `main/${userId}.png`;
   console.log('photoFile', photoFile);
   return await this.s3.saveFile(userId, photoFile.buffer, key);
 }*/
