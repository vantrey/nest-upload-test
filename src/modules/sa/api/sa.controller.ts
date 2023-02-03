import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepositories } from '../../blogs/infrastructure/query-repository/blogs-query.repositories';
import { PaginationBlogDto } from '../../blogs/api/input-Dtos/pagination-blog.dto';
import { PaginationViewDto } from '../../../common/pagination-View.dto';
import { BasicAuthGuard } from '../../../guards/basic-auth.guard';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { BindBlogCommand } from '../application/use-cases/bindBlogCommand';
import { UpdateBanInfoForBlogDto } from './input-dtos/update-ban-info-for-blog.dto';
import { UpdateBanInfoForBlogCommand } from '../application/use-cases/updateBanInfoForBlogCommand';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateQuestionDto } from './input-dtos/create-Question.dto';
import { CreateQuestionCommand } from '../application/use-cases/create-question-command';
import { QuestionForSaViewModel } from '../infrastructure/query-reposirory/question-for-sa-view.dto';
import { DeleteQuestionCommand } from '../application/use-cases/delete-question-command';
import { UpdateQuestionCommand } from '../application/use-cases/update-question-command';
import { PublisherQuestionDto } from './input-dtos/publisher-question.dto';
import { PublishQuestionCommand } from '../application/use-cases/publish-question-command';
import { PaginationQuestionDto } from './input-dtos/pagination-Question.dto';
import { QuestionQueryRepository } from '../infrastructure/query-reposirory/question-query.reposit';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogViewModel } from '../../blogs/infrastructure/query-repository/blog-view.dto';
import { ApiErrorResultDto } from '../../../common/api-error-result.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';

@SkipThrottle()
@ApiTags('QuizQuestions & Blogs')
@UseGuards(BasicAuthGuard)
@Controller(`sa`)
export class SaController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepositories,
    private readonly questionQueryRepo: QuestionQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: 'Ban/unban blog' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(204)
  @Put(`blogs/:blogId/ban`)
  async updateBanInfoForBlog(
    @Body() updateBanInfoForBlogModel: UpdateBanInfoForBlogDto,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new UpdateBanInfoForBlogCommand(updateBanInfoForBlogModel, blogId));
  }

  @ApiOperation({ summary: `Bind Blog with User (if blog doesn't have n owner yet)` })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(204)
  @Put(`blogs/:blogId/bind-with-user/:userId`)
  async bindBlog(
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Param(`userId`, ValidateUuidPipe) userId: string,
  ): Promise<boolean> {
    return await this.commandBus.execute(new BindBlogCommand(blogId, userId));
  }

  @ApiOperation({ summary: 'Returns all blogs with pagination' })
  @ApiOkResponsePaginated(BlogViewModel)
  @ApiResponse({ status: 200, description: 'The found record', type: BlogViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(`blogs`)
  async findBlogsForSa(@Query() paginationInputModel: PaginationBlogDto): Promise<PaginationViewDto<BlogViewModel>> {
    return await this.blogsQueryRepo.findBlogsForSa(paginationInputModel);
  }

  @ApiOperation({ summary: 'Returns all questions with pagination and filtering' })
  @ApiOkResponsePaginated(QuestionForSaViewModel)
  @ApiResponse({ status: 200, description: 'The found record', type: QuestionForSaViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(`quiz/questions`)
  async getQuestions(@Query() paginationInputModel: PaginationQuestionDto): Promise<PaginationViewDto<QuestionForSaViewModel>> {
    return await this.questionQueryRepo.getQuestions(paginationInputModel);
  }

  @ApiOperation({ summary: 'Create question' })
  @ApiResponse({ status: 201, description: 'success', type: QuestionForSaViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post(`quiz/questions`)
  async createQuestion(@Body() questionInputModel: CreateQuestionDto): Promise<QuestionForSaViewModel> {
    return this.commandBus.execute(new CreateQuestionCommand(questionInputModel));
  }

  @ApiOperation({ summary: 'Delete question' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found the question by id' })
  @HttpCode(204)
  @Delete(`quiz/questions/:id`)
  async deleteQuestion(@Param(`id`, ValidateUuidPipe) id: string): Promise<boolean> {
    return await this.commandBus.execute(new DeleteQuestionCommand(id));
  }

  @ApiOperation({ summary: 'Update question' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found the question by id' })
  @HttpCode(204)
  @Put(`quiz/questions/:id`)
  async updateQuestion(
    @Body() questionInputModel: CreateQuestionDto,
    @Param(`id`, ValidateUuidPipe) id: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new UpdateQuestionCommand(id, questionInputModel));
  }

  @ApiOperation({ summary: 'Publish/unpublish question' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(204)
  @Put(`quiz/questions/:id/publish`)
  async publishQuestion(
    @Param(`id`, ValidateUuidPipe) id: string,
    @Body() publishInputModel: PublisherQuestionDto,
  ): Promise<boolean> {
    return this.commandBus.execute(new PublishQuestionCommand(id, publishInputModel));
  }
}
