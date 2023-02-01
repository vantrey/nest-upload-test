import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUserIdBlogger } from '../../../decorators/current-user-id.param.decorator';
import { ConnectionQuizCommand } from '../application/use-case/connection-quiz-command';
import { JwtAuthGuard } from '../../../guards/jwt-auth-bearer.guard';
import { AnswerDto } from './input-dtos/answer-Dto-Model';
import { AnswerQuizCommand } from '../application/use-case/answer-quiz-command';
import { QuizRepositories } from '../infrastructure/quiz-repositories';
import { ValidateUuidPipeFor404Error } from '../../../validators/id-validation-pipe';
import { QuizQueryRepositories } from '../infrastructure/query-repository/quiz-query-repositories';
import { ForbiddenExceptionMY, NotFoundExceptionMY } from '../../../helpers/My-HttpExceptionFilter';
import { AnswerViewModel, GameViewModel } from '../infrastructure/query-repository/game-View-Model';
import { PaginationQuizDto } from './input-dtos/pagination-quiz-Dto';
import { PaginationViewModel } from '../../../common/pagination-View-Model';

@UseGuards(JwtAuthGuard)
@Controller(`pair-game-quiz/pairs`)
export class QuizController {
  constructor(
    private commandBus: CommandBus,
    private readonly quizRepo: QuizRepositories,
    private readonly quizQueryRepo: QuizQueryRepositories,
  ) {}

  @HttpCode(200)
  @Post(`connection`)
  async connectionQuiz(@CurrentUserIdBlogger() userId: string): Promise<GameViewModel> {
    return this.commandBus.execute(new ConnectionQuizCommand(userId));
  }

  @HttpCode(200)
  @Post(`my-current/answers`)
  async answer(@CurrentUserIdBlogger() userId: string, @Body() inputAnswerModel: AnswerDto): Promise<AnswerViewModel> {
    return this.commandBus.execute(new AnswerQuizCommand(userId, inputAnswerModel));
  }

  @Get(`my-current`)
  async getCurrentGame(@CurrentUserIdBlogger() userId: string): Promise<GameViewModel> {
    const pendingGame = await this.quizRepo.findCurrentGame(userId);
    if (!pendingGame) throw new NotFoundExceptionMY('Not found game');
    return await this.quizQueryRepo.findCurrentGame(userId);
  }

  @Get(`my`)
  async myGames(
    @CurrentUserIdBlogger() userId: string,
    @Query() paginationInputModel: PaginationQuizDto,
  ): Promise<PaginationViewModel<GameViewModel[]>> {
    return this.quizQueryRepo.getGames(userId, paginationInputModel);
  }

  @Get(`:id`)
  async getPairGame(
    @CurrentUserIdBlogger() userId: string,
    @Param(`id`, ValidateUuidPipeFor404Error) id: string,
  ): Promise<GameViewModel> {
    const activeGame = await this.quizRepo.findGame(id);
    if (!activeGame) throw new NotFoundExceptionMY('Not found active game');
    if (activeGame.isPlayerParticipate(userId))
      throw new ForbiddenExceptionMY('The player did not participate in the game');
    return this.quizQueryRepo.getGameById(userId, id);
  }
}
