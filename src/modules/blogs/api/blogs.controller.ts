import { Controller, Get, Query, Param, UseGuards, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { BlogsQueryRepositories } from '../infrastructure/query-repository/blogs-query.repositories';
import { PaginationBlogDto } from './input-Dtos/pagination-blog.dto';
import { PaginationViewDto } from '../../../common/pagination-View.dto';
import { PostsQueryRepositories } from '../../posts/infrastructure/query-repositories/posts-query.reposit';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { PostViewModel } from '../../posts/infrastructure/query-repositories/post-view.dto';
import { CurrentUserId } from '../../../decorators/current-user-id.param.decorator';
import { JwtForGetGuard } from '../../../guards/jwt-auth-bearer-for-get.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogViewModel } from '../infrastructure/query-repository/blog-view.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';
import path from 'node:path';
import { readTextFileAsync } from '../../../utils/fs-utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { BloggersService } from '../../blogger/domain/bloggers.service';
import { S3StorageAdapter } from '../../blogger/domain/s3-storage-adapter.service';
import { ApiErrorResultDto } from '../../../common/api-error-result.dto';
import { FileSizeValidationImageMainPipe } from '../../../validators/file-size-validation-image-main.pipe';

@ApiTags('Blogs')
@SkipThrottle()
@Controller(`blogs`)
export class BlogsController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepositories,
    private readonly postsQueryRepo: PostsQueryRepositories,
    private readonly bloggersService: BloggersService,
    private readonly s3: S3StorageAdapter,
  ) {}

  @ApiOperation({ summary: 'Returns blogs with pagination' })
  @ApiOkResponsePaginated(BlogViewModel)
  @ApiResponse({ status: 200, description: 'success', type: BlogViewModel })
  @Get()
  async findBlogs(@Query() paginationInputModel: PaginationBlogDto): Promise<PaginationViewDto<BlogViewModel>> {
    return await this.blogsQueryRepo.findBlogs(paginationInputModel);
  }

  @ApiOperation({ summary: 'Returns all posts for specified blog with pagination' })
  @ApiOkResponsePaginated(PostViewModel)
  @ApiResponse({ status: 200, description: 'success', type: PostViewModel })
  @UseGuards(JwtForGetGuard)
  @Get(`:blogId/posts`)
  async findPosts(
    @CurrentUserId() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Query() paginationInputModel: PaginationBlogDto,
  ): Promise<PaginationViewDto<PostViewModel>> {
    await this.blogsQueryRepo.findBlog(blogId);
    return this.postsQueryRepo.findPosts(paginationInputModel, userId, blogId);
  }

  @ApiOperation({ summary: 'Returns blog by id' })
  @ApiResponse({ status: 200, description: 'success', type: BlogViewModel })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @Get(`:id`)
  async findOne(@Param(`id`, ValidateUuidPipe) id: string): Promise<BlogViewModel> {
    return await this.blogsQueryRepo.findBlog(id);
  }

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
  }
}
