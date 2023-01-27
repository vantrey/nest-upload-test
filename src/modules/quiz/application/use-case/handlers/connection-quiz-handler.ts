import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConnectionQuizCommand } from '../connection-quiz-command';
import { UsersRepositories } from '../../../../users/infrastructure/users-repositories';
import { QuizRepositories } from '../../../infrastructure/quiz-repositories';
import { Player } from '../../../../../entities/player.entity';
import { Game } from '../../../../../entities/game.entity';
import { ForbiddenExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { GameViewModel } from '../../../infrastructure/query-repository/game-View-Model';
import { QuizQueryRepositories } from '../../../infrastructure/query-repository/quiz-query-repositories';

@CommandHandler(ConnectionQuizCommand)
export class ConnectionQuizHandler implements ICommandHandler<ConnectionQuizCommand> {
  constructor(
    private readonly quizRepo: QuizRepositories,
    private readonly usersRepo: UsersRepositories,
    private readonly quizQueryRepo: QuizQueryRepositories,
  ) {}

  async execute(command: ConnectionQuizCommand): Promise<GameViewModel> {
    const { userId } = command;
    const user = await this.usersRepo.findUserByIdWithMapped(userId);
    //find questions
    const questions = await this.quizRepo.findQuestions();
    //check active game
    const activeGame = await this.quizRepo.findActiveAndPendingGameByUserId(userId);
    if (activeGame) {
      throw new ForbiddenExceptionMY('Current user is already participating in active pair');
    }
    const pendingGame = await this.quizRepo.findPendingGame();
    if (pendingGame) {
      //creating instance player
      const player = Player.createPlayer(user.getLogin(), userId, pendingGame.id);
      const savedPlayer = await this.quizRepo.savePlayer(player);
      //adding a second player to the game
      pendingGame.addSecondPlayer(savedPlayer, userId);
      await this.quizRepo.saveGame(pendingGame);
      return this.quizQueryRepo.mappedSecondPlayerForView(pendingGame.id);
    }
    //creating instance game
    const game = Game.createGame(questions, userId); //questions
    const savedGame = await this.quizRepo.saveGame(game);
    console.log('savedGame---------------------------', savedGame);
    //creating instance player
    const player = Player.createPlayer(user.getLogin(), userId, savedGame.id);
    const savedPlayer = await this.quizRepo.savePlayer(player);
    console.log('player---------------------------', savedPlayer);
    //adding the first player to the game
    savedGame.addFirstPlayer(savedPlayer);
    await this.quizRepo.saveGame(savedGame);
    return this.quizQueryRepo.mappedFirstPlayerForView(savedGame.id);
  }
}
