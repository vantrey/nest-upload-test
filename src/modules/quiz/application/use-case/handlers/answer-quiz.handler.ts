import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositories } from '../../../infrastructure/quiz-repositories';
import { AnswerQuizCommand } from '../answer-quiz.command';
import { ForbiddenExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { AnswerViewModel } from '../../../infrastructure/query-repository/game-view.dto';
import { Game } from '../../../../../entities/game.entity';
import { Player } from '../../../../../entities/player.entity';

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
    //checking finish game
    if (activeGame.isPlayerFinished(userId))
      throw new ForbiddenExceptionMY('Current user is already participating in active pair');
    //what question!
    const question = activeGame.numberQuestion(player);
    //create instance answer
    const instanceAnswer = Player.createAnswer(answer, question.id, player);
    // const instanceAnswer = Answer.createAnswer(answer, activeGame.id, question.id, player.userId, player);
    const savedAnswer = await this.quizRepo.saveAnswer(instanceAnswer); //---
    //checking the correct answer
    if (activeGame.isAnswerCorrect(answer, question)) {
      //add correct answer
      savedAnswer.correctAnswer();
      await this.quizRepo.saveAnswer(savedAnswer);
      //find an active game
      const activeGame = await this.quizRepo.findActiveGameByUserId(userId);
      //checking the finish game!
      if (activeGame.isGameFinished()) {
        //add status "finished" the game
        activeGame.finishGame();
        await this.quizRepo.saveGame(activeGame);
        //add bonus a point
        await this.addBonusPoint(activeGame);
        //change status players => "finished"
        await this.changeStatusesPlayer(activeGame);
      }
      const player = await this.quizRepo.findPlayerForAddPoint(userId, activeGame.id);
      //add a point
      player.addPoint();
      await this.quizRepo.savePlayer(player);
      //the answer for viewing
      return new AnswerViewModel(savedAnswer.questionId, savedAnswer.answerStatus, savedAnswer.addedAt.toISOString());
    }
    //add incorrect answer
    savedAnswer.incorrectAnswer();
    await this.quizRepo.saveAnswer(savedAnswer);
    //find an active game
    const game = await this.quizRepo.findActiveGameByUserId(userId);
    //checking the finish game!
    if (game.isGameFinished()) {
      //add status "finished" the game
      game.finishGame();
      const savedGame = await this.quizRepo.saveGame(game);
      await this.addBonusPoint(savedGame);
      //change status players
      await this.changeStatusesPlayer(game);
    }
    //change status players
    return new AnswerViewModel(savedAnswer.questionId, savedAnswer.answerStatus, savedAnswer.addedAt.toISOString());
  }

  private async addBonusPoint(game: Game): Promise<boolean> {
    const firstPlayer = await this.quizRepo.findPlayerForAddBonusPoint(game.firstPlayerId, game.id);
    const secondPlayer = await this.quizRepo.findPlayerForAddBonusPoint(game.secondPlayerId, game.id);
    const playerWithAddedPoint = game.addBonusPoint(firstPlayer, secondPlayer);
    if (playerWithAddedPoint) {
      await this.quizRepo.savePlayer(playerWithAddedPoint);
    }
    return true;
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
