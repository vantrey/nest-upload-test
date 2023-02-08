import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { BaseTransaction } from '../../../../../helpers/base-transaction';
import { AnswerQuizCommand } from '../answer-quiz.command';
import { AnswerViewModel } from '../../../infrastructure/query-repository/game-view.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { QuizRepositories } from '../../../infrastructure/quiz-repositories';

// @Injectable()
// @CommandHandler(AnswerQuizCommand)
export class AnswerTransaction
  extends BaseTransaction<AnswerQuizCommand, AnswerViewModel>
  implements ICommandHandler<AnswerQuizCommand>
{
  dataSource: DataSource;
  constructor(private readonly quizRepo: QuizRepositories, connection: DataSource) {
    super(connection);
    this.dataSource = connection;
  }
  async execute(command: AnswerQuizCommand): Promise<AnswerViewModel> {
    return await this.run(command);
  }

  // the important thing here is to use the manager that we've created in the base class
  protected async onExecute(data: AnswerQuizCommand, manager: EntityManager): Promise<AnswerViewModel> {
    const { answer } = data.inputAnswerModel;
    const { userId } = data;
    //find an active game
    const activeGame = await this.quizRepo.findActiveGameByUserIdManager(userId, manager);
    console.log('activeGame--+-', activeGame);
    if (!activeGame) throw new ForbiddenExceptionMY('Current user is already participating in active pair');
    //find active player
    const player = await this.quizRepo.findPlayerManager(userId, activeGame.id, manager);
    const result = activeGame.stageGame(userId, answer, player);
    if (result.player && result.instanceAnswer) {
      await this.quizRepo.savePlayer(result.player, manager);
      await this.quizRepo.saveAnswer(result.instanceAnswer, manager);
    } else {
      await this.quizRepo.saveAnswer(result.instanceAnswer, manager);
    }
    //find an active game for correct relations
    const games = await this.quizRepo.findActiveGameByUserIdManager(userId, manager);
    if (games.isGameFinished()) {
      games.finishGame();
      const firstPlayer = await this.quizRepo.findPlayerForAddBonusPointManager(games.firstPlayerId, games.id, manager);
      const secondPlayer = await this.quizRepo.findPlayerForAddBonusPointManager(games.secondPlayerId, games.id, manager);
      //add bonus point
      const res = await games.stageSecondGame(firstPlayer, secondPlayer);
      await this.quizRepo.savePlayer(res.firstPlayer, manager);
      await this.quizRepo.savePlayer(res.secondPlayer, manager);
      await this.quizRepo.saveGame(games, manager);
    }
    return new AnswerViewModel(
      result.instanceAnswer.questionId,
      result.instanceAnswer.answerStatus,
      result.instanceAnswer.addedAt.toISOString(),
    );
  }
}
