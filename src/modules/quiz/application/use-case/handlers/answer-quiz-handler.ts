import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositories } from '../../../infrastructure/quiz-repositories';
import { AnswerQuizCommand } from '../answer-quiz-command';
import { ForbiddenExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { Answer } from '../../../../../entities/answer.entity';
import { AnswerViewModel } from '../../../infrastructure/query-repository/game-View-Model';
import { Game } from '../../../../../entities/game.entity';

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
    if (player.answers.length === activeGame.questions.length)
      throw new ForbiddenExceptionMY('Current user is already participating in active pair');
    //what question!
    const question = activeGame.questions[player.answers.length];
    //create instance answer
    const instanceAnswer = Answer.createAnswer(answer, activeGame.id, question.id, player.id, player);
    const savedAnswer = await this.quizRepo.saveAnswer(instanceAnswer);
    //checking the correct answer
    const result = question.correctAnswers.find((e) => e === answer);
    if (result) {
      //add correct answer
      savedAnswer.correctAnswer();
      await this.quizRepo.saveAnswer(savedAnswer);
      //find an active game
      const activeGame = await this.quizRepo.findActiveGameByUserId(userId);
      //checking the finish game!
      if (activeGame.firstPlayerProgress.answers.length === 5 && activeGame.secondPlayerProgress.answers.length === 5) {
        //add status "finished" the game
        activeGame.finishDate();
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
    if (game.firstPlayerProgress.answers.length === 5 && game.secondPlayerProgress.answers.length === 5) {
      //add status "finished" the game
      game.finishDate();
      await this.quizRepo.saveGame(game);
      await this.addBonusPoint(game);
      //change status players
      await this.changeStatusesPlayer(game);
    }
    //change status players
    return new AnswerViewModel(savedAnswer.questionId, savedAnswer.answerStatus, savedAnswer.addedAt.toISOString());
  }

  private async addBonusPoint(game: Game): Promise<boolean> {
    const successAnswersFirstPlayer = await this.quizRepo.fastestFirstSuccessAnswer(game.firstPlayerId, game.id);
    const successAnswersSecondPlayer = await this.quizRepo.fastestFirstSuccessAnswer(game.secondPlayerId, game.id);
    if (
      successAnswersFirstPlayer.length >= 1 &&
      successAnswersFirstPlayer[0].addedAt < successAnswersSecondPlayer[0].addedAt
    ) {
      const player = await this.quizRepo.findPlayer(game.firstPlayerId, game.id);
      player.addPoint();
      await this.quizRepo.savePlayer(player);
    }
    if (
      successAnswersSecondPlayer.length >= 1 &&
      successAnswersFirstPlayer[0].addedAt > successAnswersSecondPlayer[0].addedAt
    ) {
      const player = await this.quizRepo.findPlayer(game.secondPlayerId, game.id);
      player.addPoint();
      await this.quizRepo.savePlayer(player);
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
