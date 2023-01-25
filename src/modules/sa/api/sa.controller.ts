import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepositories } from '../../blogs/infrastructure/query-repository/blogs-query.repositories';
import { PaginationBlogDto } from '../../blogs/api/input-Dtos/pagination-Blog-Dto';
import { PaginationViewModel } from '../../../common/pagination-View-Model';
import { BlogViewModel } from '../../blogs/infrastructure/query-repository/blog-View-Model';
import { BasicAuthGuard } from '../../../guards/basic-auth.guard';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { BindBlogCommand } from '../application/use-cases/bindBlogCommand';
import { UpdateBanInfoForBlogDto } from './input-dtos/update-ban-info-for-blog-Dto-Model';
import { UpdateBanInfoForBlogCommand } from '../application/use-cases/updateBanInfoForBlogCommand';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateQuestionDto } from './input-dtos/create-Question-Dto-Model';
import { CreateQuestionCommand } from '../application/use-cases/create-question-command';
import { QuestionViewModel } from '../infrastructure/query-reposirory/question-View-Model';
import { DeleteQuestionCommand } from '../application/use-cases/delete-question-command';
import { UpdateQuestionCommand } from '../application/use-cases/update-question-command';
import { PublisherQuestionDto } from './input-dtos/publisher-question-Dto-Model';
import { PublishQuestionCommand } from '../application/use-cases/publish-question-command';
import { PaginationQuestionDto } from './input-dtos/pagination-Question-Dto';
import { QuestionQueryRepository } from '../infrastructure/query-reposirory/question-query.reposit';

@SkipThrottle()
@UseGuards(BasicAuthGuard)
@Controller(`sa`)
export class SaController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepositories,
    private readonly questionQueryRepo: QuestionQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @HttpCode(204)
  @Put(`blogs/:blogId/ban`)
  async updateBanInfoForBlog(
    @Body() updateBanInfoForBlogModel: UpdateBanInfoForBlogDto,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
  ): Promise<boolean> {
    return this.commandBus.execute(
      new UpdateBanInfoForBlogCommand(updateBanInfoForBlogModel, blogId),
    );
  }

  @HttpCode(204)
  @Put(`blogs/:blogId/bind-with-user/:userId`)
  async bindBlog(
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Param(`userId`, ValidateUuidPipe) userId: string,
  ) {
    return await this.commandBus.execute(new BindBlogCommand(blogId, userId));
  }

  @Get(`blogs`)
  async findAll(
    @Query() paginationInputModel: PaginationBlogDto,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    return await this.blogsQueryRepo.findBlogsForSa(paginationInputModel);
  }

  @Get(`quiz/questions`)
  async getQuestions(
    @Query() paginationInputModel: PaginationQuestionDto,
  ): Promise<PaginationViewModel<QuestionViewModel[]>> {
    return await this.questionQueryRepo.getQuestions(paginationInputModel);
  }

  @Post(`quiz/questions`)
  async createQuestion(
    @Body() questionInputModel: CreateQuestionDto,
  ): Promise<QuestionViewModel> {
    return this.commandBus.execute(
      new CreateQuestionCommand(questionInputModel),
    );
  }

  @HttpCode(204)
  @Delete(`quiz/questions/:id`)
  async deleteQuestion(
    @Param(`id`, ValidateUuidPipe) id: string,
  ): Promise<boolean> {
    return await this.commandBus.execute(new DeleteQuestionCommand(id));
  }

  @HttpCode(204)
  @Put(`quiz/questions/:id`)
  async updateQuestion(
    @Body() questionInputModel: CreateQuestionDto,
    @Param(`id`, ValidateUuidPipe) id: string,
  ): Promise<boolean> {
    return this.commandBus.execute(
      new UpdateQuestionCommand(id, questionInputModel),
    );
  }

  @HttpCode(204)
  @Put(`quiz/questions/:id/publish`)
  async publishQuestion(
    @Param(`id`, ValidateUuidPipe) id: string,
    @Body() publishInputModel: PublisherQuestionDto,
  ): Promise<boolean> {
    return this.commandBus.execute(
      new PublishQuestionCommand(id, publishInputModel),
    );
  }
}
