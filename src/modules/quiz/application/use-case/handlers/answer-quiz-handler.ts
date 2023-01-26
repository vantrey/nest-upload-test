import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositories } from '../../../infrastructure/quiz-repositories';
import { AnswerQuizCommand } from '../answer-quiz-command';
import { ForbiddenExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { Answer } from '../../../../../entities/answer.entity';
import { AnswerViewModel } from '../../../infrastructure/query-repository/game-View-Model';

@CommandHandler(AnswerQuizCommand)
export class AnswerQuizHandler implements ICommandHandler<AnswerQuizCommand> {
  constructor(private readonly quizRepo: QuizRepositories) {}

  async execute(command: AnswerQuizCommand): Promise<AnswerViewModel> {
    const { answer } = command.inputAnswerModel;
    const { userId } = command;
    //checking active game
    const activeGame = await this.quizRepo.findActiveGameByUserId(userId);
    if (!activeGame) throw new ForbiddenExceptionMY('Current user is already participating in active pair');
    //counting answers for the current game
    const player = await this.quizRepo.findPlayer(userId, activeGame.id);
    if (player.answers.length === activeGame.questions.length)
      throw new ForbiddenExceptionMY('Current user is already participating in active pair');
    const question = activeGame.questions[player.answers.length];
    const instanceAnswer = Answer.createAnswer(answer, activeGame.id, question.id, player.id, player);
    const savedAnswer = await this.quizRepo.saveAnswer(instanceAnswer);
    const result = question.correctAnswers.find((e) => e === answer);
    if (result) {
      savedAnswer.correctAnswer();
      await this.quizRepo.saveAnswer(savedAnswer);
      //checking the finish game!
      const activeGame = await this.quizRepo.findActiveGameByUserId(userId);
      if (activeGame.firstPlayerProgress.answers.length === 5 && activeGame.secondPlayerProgress.answers.length === 5) {
        activeGame.finishDate();
        await this.quizRepo.saveGame(activeGame);
      }

      const player = await this.quizRepo.findPlayer(userId, activeGame.id);
      const successAnswers = await this.quizRepo.countSuccessAnswers(userId, activeGame.id);
      if (successAnswers === 5) {
        player.addScore();
      }
      player.addScore();
      await this.quizRepo.savePlayer(player);
      return new AnswerViewModel(savedAnswer.questionId, savedAnswer.answerStatus, savedAnswer.addedAt.toISOString());
    }
    savedAnswer.incorrectAnswer();
    await this.quizRepo.saveAnswer(savedAnswer);
    const game = await this.quizRepo.findActiveGameByUserId(userId);
    if (game.firstPlayerProgress.answers.length === 5 && game.secondPlayerProgress.answers.length === 5) {
      game.finishDate();
      await this.quizRepo.saveGame(game);
    }
    return new AnswerViewModel(savedAnswer.questionId, savedAnswer.answerStatus, savedAnswer.addedAt.toISOString());
  }
}
