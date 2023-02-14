import { Controller, Get, Query, Param, UseGuards, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BlogsQueryRepositories } from '../infrastructure/query-repository/blogs-query.repositories';
import { PaginationBlogDto } from './input-Dtos/pagination-blog.dto';
import { PaginationViewDto } from '../../../common/pagination-View.dto';
import { PostsQueryRepositories } from '../../posts/infrastructure/query-repositories/posts-query.reposit';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { PostViewModel } from '../../posts/infrastructure/query-repositories/post-view.dto';
import { CurrentUserId } from '../../../decorators/current-user-id.param.decorator';
import { JwtForGetGuard } from '../../../guards/jwt-auth-bearer-for-get.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogViewModel } from '../infrastructure/query-repository/blog-view.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';
import path from 'node:path';
import { ensureDirSync, readTextFileAsync, saveFileAsync } from '../../../utils/fs-utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { BloggersService } from '../../blogger/domain/bloggers.service';
import { randomUUID } from 'crypto';
import { S3StorageAdapter } from '../../blogger/domain/s3-storage-adapter.service';

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

  @Post('photo/save')
  @UseInterceptors(FileInterceptor('photo'))
  async createPhoto(@UploadedFile() photoFile: Express.Multer.File) {
    const userId = randomUUID({});
    console.log(photoFile.buffer);
    // const pathDir = path.join('-------photos', 'wallpaper-blog', '3');
    // await ensureDirSync(pathDir);
    // await saveFileAsync(pathDir, photoFile.originalname, photoFile.buffer);
    // const res = await this.bloggersService.execute(userId, photoFile.originalname, photoFile.buffer);
    const res = await this.s3.saveFile(userId, photoFile.buffer);
    return res;
  }
}
