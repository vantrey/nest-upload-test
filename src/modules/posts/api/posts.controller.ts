import { Body, Controller, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PostsQueryRepositories } from '../infrastructure/query-repositories/posts-query.reposit';
import { PaginationViewDto } from '../../../common/pagination-View.dto';
import { PostViewModel } from '../infrastructure/query-repositories/post-view.dto';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { JwtAuthGuard } from '../../../guards/jwt-auth-bearer.guard';
import { UpdateLikeStatusDto } from './input-Dtos/update-Like-Status.dto';
import { CurrentUserId } from '../../../decorators/current-user-id.param.decorator';
import { CreateCommentDto } from './input-Dtos/create-comment.dto';
import { JwtForGetGuard } from '../../../guards/jwt-auth-bearer-for-get.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../application/use-cases/create-comment-command';
import { UpdateLikeStatusCommand } from '../application/use-cases/update-like-status-command';
import { SkipThrottle } from '@nestjs/throttler';
import { PaginationDto } from '../../../common/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentViewModel } from '../../comments/infrastructure/query-repository/comment-view.dto';
import { ApiErrorResultDto } from '../../../common/api-error-result.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';

@ApiTags('Posts')
@SkipThrottle()
@Controller(`posts`)
export class PostsController {
  constructor(private readonly postsQueryRepo: PostsQueryRepositories, private commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Make like/unlike/dislike/undislike operation' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found post' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(`:postId/like-status`)
  async updateLikeStatus(
    @CurrentUserId() userId: string,
    @Param(`postId`, ValidateUuidPipe) id: string,
    @Body() updateLikeStatusInputModel: UpdateLikeStatusDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(new UpdateLikeStatusCommand(id, updateLikeStatusInputModel, userId));
  }

  @ApiOperation({ summary: 'Returns all comments for specified post with pagination' })
  @ApiOkResponsePaginated(CommentViewModel)
  @ApiResponse({ status: 200, description: 'success', type: CommentViewModel })
  @ApiResponse({ status: 404, description: 'Not found post' })
  @UseGuards(JwtForGetGuard)
  @Get(`:postId/comments`)
  async findComments(
    @CurrentUserId() userId: string,
    @Param(`postId`, ValidateUuidPipe) id: string,
    @Query() paginationInputModel: PaginationDto,
  ): Promise<PaginationViewDto<CommentViewModel>> {
    return await this.postsQueryRepo.findCommentsByIdPost(id, paginationInputModel, userId);
  }

  @ApiOperation({ summary: 'Create new comment' })
  @ApiResponse({ status: 201, description: 'success', type: CommentViewModel })
  @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found post' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(`:postId/comments`)
  async createComment(
    @CurrentUserId() userId: string,
    @Param(`postId`, ValidateUuidPipe) id: string,
    @Body() inputCommentModel: CreateCommentDto,
  ): Promise<CommentViewModel> {
    return await this.commandBus.execute(new CreateCommentCommand(id, inputCommentModel, userId));
  }

  @ApiOperation({ summary: 'Returns all posts with pagination' })
  @ApiOkResponsePaginated(PostViewModel)
  @ApiResponse({ status: 200, description: 'success', type: PostViewModel })
  @UseGuards(JwtForGetGuard)
  @Get()
  async findAll(@CurrentUserId() userId: string, @Query() pagination: PaginationDto): Promise<PaginationViewDto<PostViewModel>> {
    return await this.postsQueryRepo.findPosts(pagination, userId);
  }

  @ApiOperation({ summary: 'Return post by id' })
  @ApiResponse({ status: 200, description: 'success', type: PostViewModel })
  @UseGuards(JwtForGetGuard)
  @Get(`:id`)
  async findOne(@CurrentUserId() userId: string, @Param(`id`, ValidateUuidPipe) id: string): Promise<PostViewModel> {
    return await this.postsQueryRepo.findPost(id, userId);
  }
}
