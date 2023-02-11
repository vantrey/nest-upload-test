import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositories } from '../../../infrastructure/quiz-repositories';
import { ForbiddenExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { AnswerViewModel } from '../../../infrastructure/query-repository/game-view.dto';
import { AnswerQuizCommand } from '../answer-quiz.command';
import { Cron, CronExpression } from '@nestjs/schedule';

@CommandHandler(AnswerQuizCommand)
export class AnswerQuizHandler implements ICommandHandler<AnswerQuizCommand> {
  constructor(private readonly quizRepo: QuizRepositories) {}

  async execute(command: AnswerQuizCommand): Promise<AnswerViewModel> {
    const { answer } = command.inputAnswerModel;
    const { userId } = command;
    const activeGame = await this.quizRepo.findActiveGameByUserId(userId);
    if (!activeGame) throw new ForbiddenExceptionMY('Current user is already participating in active pair');
    activeGame.game(userId, answer);
    await this.quizRepo.saveGame(activeGame);
    const result =
      activeGame.getIdFirstPlayer() === userId ? activeGame.getLastAnswerFirstPlayer() : activeGame.getLastAnswerSecondPlayer();
    return new AnswerViewModel(result.questionId, result.answerStatus, result.addedAt.toISOString());
  }

  @Cron(CronExpression.EVERY_SECOND)
  async forcedFinishGames() {
    try {
      const games = await this.quizRepo.forcedFinishGame(); //select for update
      if (!games) return;
      // console.log('---time', games);
      for (let i = 1; i <= games.length; i++) {
        games[i - 1].forcedFinishGame();
        await this.quizRepo.saveGame(games[i - 1]);
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }

  /*  private async forcedFinishGame(game: Game) {
    await this.wait(10);
    const activeGame = await this.quizRepo.findActiveGame(game.id); //select for update
    if (activeGame.isGameFinished()) return;
    const answers = activeGame.unAnsweredQuestion();
    for (let i = 1; i <= answers.length; i++) {
      await this.quizRepo.saveAnswer(answers[i - 1]);
    }
    activeGame.forcedFinishGame();
    await this.quizRepo.saveGame(activeGame);
  }
*/
}
