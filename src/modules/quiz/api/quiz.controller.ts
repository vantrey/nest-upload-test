import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
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
    return await this.quizQueryRepo.getCurrentActiveGame(userId);
  }

  @Get(`:id`)
  async getPairGame(
    @CurrentUserIdBlogger() userId: string,
    @Param(`id`, ValidateUuidPipeFor404Error) id: string,
  ): Promise<GameViewModel> {
    const activeGame = await this.quizRepo.findAnyGameById(id);
    if (!activeGame) throw new NotFoundExceptionMY('Not found active game');
    if (activeGame.firstPlayerId !== userId && activeGame.secondPlayerId !== userId)
      throw new ForbiddenExceptionMY('The player did not participate in the game');
    return this.quizQueryRepo.getPairGameById(userId, id);
  }
}
