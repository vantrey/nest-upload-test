import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUserIdBlogger } from '../../../decorators/current-user-id.param.decorator';
import { ConnectionQuizCommand } from '../application/use-case/connection-quiz.command';
import { JwtAuthGuard } from '../../../guards/jwt-auth-bearer.guard';
import { AnswerDto } from './input-dtos/create-answer.dto';
import { AnswerQuizCommand } from '../application/use-case/answer-quiz.command';
import { QuizRepositories } from '../infrastructure/quiz-repositories';
import { ValidateUuidPipeFor404Error } from '../../../validators/id-validation-pipe';
import { QuizQueryRepositories } from '../infrastructure/query-repository/quiz-query-repositories';
import { ForbiddenExceptionMY, NotFoundExceptionMY } from '../../../helpers/My-HttpExceptionFilter';
import { AnswerViewModel, GameViewModel } from '../infrastructure/query-repository/game-view.dto';
import { PaginationQuizDto } from './input-dtos/pagination-quiz.dto';
import { PaginationViewDto } from '../../../common/pagination-View.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResultDto } from '../../../common/api-error-result.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';

@ApiTags('PairQuizGame')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(`pair-game-quiz/pairs`)
export class QuizController {
  constructor(
    private commandBus: CommandBus,
    private readonly quizRepo: QuizRepositories,
    private readonly quizQueryRepo: QuizQueryRepositories,
  ) {}

  @ApiOperation({
    summary: 'Connect current user to existing random pending pair or create new pair which will be waiting second player',
  })
  @ApiResponse({ status: 200, description: 'success', type: GameViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Current user is already participating in active pair' })
  @HttpCode(200)
  @Post(`connection`)
  async connectionQuiz(@CurrentUserIdBlogger() userId: string): Promise<GameViewModel> {
    return this.commandBus.execute(new ConnectionQuizCommand(userId));
  }

  @ApiOperation({ summary: 'Send answer for next not answered question in active pair' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Current user is already participating in active pair' })
  @HttpCode(200)
  @Post(`my-current/answers`)
  async answer(@CurrentUserIdBlogger() userId: string, @Body() inputAnswerModel: AnswerDto): Promise<AnswerViewModel> {
    return this.commandBus.execute(new AnswerQuizCommand(userId, inputAnswerModel));
  }

  @ApiOperation({ summary: 'Returns current unfinished user game' })
  @ApiResponse({ status: 200, description: 'success', type: GameViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found active pair for current user' })
  @Get(`my-current`)
  async getCurrentGame(@CurrentUserIdBlogger() userId: string): Promise<GameViewModel> {
    const pendingGame = await this.quizRepo.findCurrentGame(userId);
    if (!pendingGame) throw new NotFoundExceptionMY('Not found game');
    return await this.quizQueryRepo.findCurrentGame(userId);
  }

  @ApiOperation({ summary: 'Returns all my games (closed games and current)' })
  @ApiOkResponsePaginated(GameViewModel)
  @ApiResponse({ status: 200, description: 'success', type: GameViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(`my`)
  async myGames(
    @CurrentUserIdBlogger() userId: string,
    @Query() paginationInputModel: PaginationQuizDto,
  ): Promise<PaginationViewDto<GameViewModel>> {
    return this.quizQueryRepo.getGames(userId, paginationInputModel);
  }

  @ApiOperation({ summary: 'Returns game by id' })
  @ApiResponse({ status: 200, description: 'success', type: GameViewModel })
  @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Current user is already participating in active pair' })
  @ApiResponse({ status: 404, description: 'Not found game' })
  @Get(`:id`)
  async getPairGame(
    @CurrentUserIdBlogger() userId: string,
    @Param(`id`, ValidateUuidPipeFor404Error) id: string,
  ): Promise<GameViewModel> {
    const activeGame = await this.quizRepo.findGame(id);
    if (!activeGame) throw new NotFoundExceptionMY('Not found active game');
    if (activeGame.isPlayerParticipate(userId)) throw new ForbiddenExceptionMY('The player did not participate in the game');
    return this.quizQueryRepo.getGameById(userId, id);
  }
}
