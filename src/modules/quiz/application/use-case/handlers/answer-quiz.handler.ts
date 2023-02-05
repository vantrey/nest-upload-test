import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositories } from '../../../infrastructure/quiz-repositories';
import { ForbiddenExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { AnswerViewModel } from '../../../infrastructure/query-repository/game-view.dto';
import { AnswerQuizCommand } from '../answer-quiz.command';

@CommandHandler(AnswerQuizCommand)
export class AnswerQuizHandler implements ICommandHandler<AnswerQuizCommand> {
  constructor(private readonly quizRepo: QuizRepositories) {}

  async execute(command: AnswerQuizCommand): Promise<AnswerViewModel> {
    const { answer } = command.inputAnswerModel;
    const { userId } = command;
    //find an active game
    const activeGame = await this.quizRepo.findActiveGameByUserId(userId);
    if (!activeGame) throw new ForbiddenExceptionMY('Current user is already participating in active pair');
    //find active player
    const player = await this.quizRepo.findPlayer(userId, activeGame.id);
    const result = activeGame.stageGame(userId, answer, player);
    if (result.player && result.instanceAnswer) {
      await this.quizRepo.savePlayer(result.player);
      await this.quizRepo.saveAnswer(result.instanceAnswer);
    } else {
      await this.quizRepo.saveAnswer(result.instanceAnswer);
    }
    //find an active game for correct relations
    const games = await this.quizRepo.findActiveGameByUserId(userId);
    if (games.isGameFinished()) {
      games.finishGame();
      const firstPlayer = await this.quizRepo.findPlayerForAddBonusPoint(games.firstPlayerId, games.id);
      const secondPlayer = await this.quizRepo.findPlayerForAddBonusPoint(games.secondPlayerId, games.id);
      //add bonus point
      const res = await games.stageSecondGame(firstPlayer, secondPlayer);
      await this.quizRepo.savePlayer(res.firstPlayer);
      await this.quizRepo.savePlayer(res.secondPlayer);
      await this.quizRepo.saveGame(games);
    }
    return new AnswerViewModel(
      result.instanceAnswer.questionId,
      result.instanceAnswer.answerStatus,
      result.instanceAnswer.addedAt.toISOString(),
    );
  }
}
