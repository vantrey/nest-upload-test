import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositories } from '../../../infrastructure/quiz-repositories';
import { ForbiddenExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { AnswerViewModel } from '../../../infrastructure/query-repository/game-view.dto';
import { Game } from '../../../../../entities/game.entity';
import { AnswerRQuizCommand } from '../answerR-quiz.command';

@CommandHandler(AnswerRQuizCommand)
export class AnswerRQuizHandler implements ICommandHandler<AnswerRQuizCommand> {
  constructor(private readonly quizRepo: QuizRepositories) {}

  async execute(command: AnswerRQuizCommand): Promise<AnswerViewModel> {
    const { answer } = command.inputAnswerModel;
    const { userId } = command;
    //find an active game
    const activeGame = await this.quizRepo.findActiveGameByUserId(userId);
    if (!activeGame) throw new ForbiddenExceptionMY('Current user is already participating in active pair');
    //find active player
    const player = await this.quizRepo.findPlayer(userId, activeGame.id);
    const result = activeGame.firstStageGame(userId, answer, player);
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
      const playerWithBonusPoint = games.addBonusPoint(firstPlayer, secondPlayer);
      if (playerWithBonusPoint) {
        await this.quizRepo.savePlayer(playerWithBonusPoint);
      }
      //change status players
      await this.changeStatusesPlayer(games);
      await this.quizRepo.saveGame(games);
    }

    return new AnswerViewModel(
      result.instanceAnswer.questionId,
      result.instanceAnswer.answerStatus,
      result.instanceAnswer.addedAt.toISOString(),
    );
  }

  private async changeStatusesPlayer(game: Game): Promise<boolean> {
    const firstPlayer = await this.quizRepo.findPlayer(game.firstPlayerId, game.id);
    const secondPlayer = await this.quizRepo.findPlayer(game.secondPlayerId, game.id);
    firstPlayer.changeStatuses();
    secondPlayer.changeStatuses();
    await this.quizRepo.savePlayer(firstPlayer);
    await this.quizRepo.savePlayer(secondPlayer);
    return true;
  }
}
