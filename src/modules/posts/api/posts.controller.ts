import { Body, Controller, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PostsQueryRepositories } from '../infrastructure/query-repositories/posts-query.reposit';
import { PaginationViewDto } from '../../../common/pagination-View.dto';
import { PostViewDto } from '../infrastructure/query-repositories/post-view.dto';
import { CommentsViewType } from '../../comments/infrastructure/query-repository/comments-View-Model';
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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@SkipThrottle()
@Controller(`posts`)
export class PostsController {
  constructor(private readonly postsQueryRepo: PostsQueryRepositories, private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(`:postId/like-status`)
  async updateLikeStatus(
    @CurrentUserId() userId: string,
    @Param(`postId`, ValidateUuidPipe) id: string,
    @Body() updateLikeStatusInputModel: UpdateLikeStatusDto,
  ) {
    return await this.commandBus.execute(new UpdateLikeStatusCommand(id, updateLikeStatusInputModel, userId));
  }

  @UseGuards(JwtForGetGuard)
  @Get(`:postId/comments`)
  async findComments(
    @CurrentUserId() userId: string,
    @Param(`postId`, ValidateUuidPipe) id: string,
    @Query() paginationInputModel: PaginationDto,
  ): Promise<PaginationViewDto<CommentsViewType[]>> {
    return await this.postsQueryRepo.findCommentsByIdPost(id, paginationInputModel, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(`:postId/comments`)
  async createComment(
    @CurrentUserId() userId: string,
    @Param(`postId`, ValidateUuidPipe) id: string,
    @Body() inputCommentModel: CreateCommentDto,
  ) {
    return await this.commandBus.execute(new CreateCommentCommand(id, inputCommentModel, userId));
  }

  @UseGuards(JwtForGetGuard)
  @Get()
  async findAll(@CurrentUserId() userId: string, @Query() pagination: PaginationDto): Promise<PaginationViewDto<PostViewDto[]>> {
    return await this.postsQueryRepo.findPosts(pagination, userId);
  }

  @UseGuards(JwtForGetGuard)
  @Get(`:id`)
  async findOne(@CurrentUserId() userId: string, @Param(`id`, ValidateUuidPipe) id: string): Promise<PostViewDto> {
    return await this.postsQueryRepo.findPost(id, userId);
  }
}
