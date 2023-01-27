import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameStatusesType } from '../../../../entities/game.entity';
import { Player } from '../../../../entities/player.entity';
import { Question } from '../../../../entities/question.entity';
import { Answer } from '../../../../entities/answer.entity';
import { AnswerViewModel, GamePlayerProgressViewModel, GameViewModel, PLayerViewModel } from './game-View-Model';

export class QuizQueryRepositories {
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>,
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  private mappedAnswerForView(answer: Answer): AnswerViewModel {
    return new AnswerViewModel(answer.questionId, answer.answerStatus, answer.addedAt.toISOString());
  }

  private async mappedGameForView(game: Game): Promise<GameViewModel> {
    // const [firstAnswers, secondAnswers] = await Promise.all([
    //   this.answerRepo.find({
    //     select: ['questionId', 'answerStatus', 'addedAt'],
    //     where: { gameId: game.id, playerId: game.secondPlayerId },
    //   }),
    //   this.answerRepo.find({
    //     select: ['questionId', 'answerStatus', 'addedAt'],
    //     where: { gameId: game.id, playerId: game.secondPlayerId },
    //   }),
    // ]);
    const firstPlayer = new PLayerViewModel(game.firstPlayerProgress.id, game.firstPlayerProgress.login);
    const answersFirstPlayer = await Promise.all(
      game.firstPlayerProgress.answers.map((a) => this.mappedAnswerForView(a)),
    );
    const answersSecondPlayer = await Promise.all(
      game.secondPlayerProgress.answers.map((a) => this.mappedAnswerForView(a)),
    );
    const secondPlayer = new PLayerViewModel(game.secondPlayerProgress.id, game.secondPlayerProgress.login);
    const firstPlayerProgress = new GamePlayerProgressViewModel(
      answersFirstPlayer,
      firstPlayer,
      game.firstPlayerProgress.score,
    );
    const secondPlayerProgress = new GamePlayerProgressViewModel(
      answersSecondPlayer,
      secondPlayer,
      game.secondPlayerProgress.score,
    );
    return new GameViewModel(
      game.id,
      firstPlayerProgress,
      secondPlayerProgress,
      game.questions,
      game.status,
      game.pairCreatedDate.toISOString(),
      game.startGameDate ? game.startGameDate.toISOString() : null,
      game.finishGameDate ? game.finishGameDate.toISOString() : null,
    );
  }

  async getPairGameById(userId: string, id: string): Promise<GameViewModel> {
    const game = await this.gameRepo.findOne({
      relations: {
        firstPlayerProgress: true,
        secondPlayerProgress: true,
        questions: true,
      },
      where: [
        { id: id, firstPlayerId: userId },
        { id: id, secondPlayerId: userId },
      ],
    });
    if (!game.secondPlayerProgress) {
      return await this.mappedFirstPlayerForView(game.id);
    }
    return await this.mappedGameForView(game);
  }

  async getCurrentActiveGame(userId: string): Promise<GameViewModel> {
    const game = await this.gameRepo.findOne({
      relations: {
        firstPlayerProgress: true,
        secondPlayerProgress: true,
        questions: true,
      },
      where: [
        { firstPlayerId: userId, status: GameStatusesType.Active },
        { secondPlayerId: userId, status: GameStatusesType.Active },
      ],
    });
    return await this.mappedGameForView(game);
  }

  async mappedFirstPlayerForView(gameId: string): Promise<GameViewModel> {
    const game = await this.gameRepo.findOne({
      select: [],
      relations: { firstPlayerProgress: true, secondPlayerProgress: true, questions: true },
      where: { id: gameId },
    });
    // return this.mappedGameForView(game);
    const firstPlayer = new PLayerViewModel(game.firstPlayerProgress.id, game.firstPlayerProgress.login);
    const answersFirstPlayer = await Promise.all(
      game.firstPlayerProgress.answers.map((a) => this.mappedAnswerForView(a)),
    );
    const firstPlayerProgress = new GamePlayerProgressViewModel(
      answersFirstPlayer,
      firstPlayer,
      game.firstPlayerProgress.score,
    );
    return new GameViewModel(
      game.id,
      firstPlayerProgress,
      null,
      game.questions,
      game.status,
      game.pairCreatedDate.toISOString(),
      game.startGameDate ? game.startGameDate.toISOString() : null,
      game.finishGameDate ? game.finishGameDate.toISOString() : null,
    );
  }

  async mappedSecondPlayerForView(gameId: string): Promise<GameViewModel> {
    const game = await this.gameRepo.findOne({
      select: [],
      relations: { firstPlayerProgress: true, secondPlayerProgress: true, questions: true },
      where: { id: gameId },
    });
    return this.mappedGameForView(game);
    // const firstPlayer = new PLayerViewModel(game.firstPlayerProgress.id, game.firstPlayerProgress.login);
    // const answersFirstPlayer = await Promise.all(
    //   game.firstPlayerProgress.answers.map((a) => this.mappedAnswerForView(a)),
    // );
    // const firstPlayerProgress = new GamePlayerProgressViewModel(
    //   answersFirstPlayer,
    //   firstPlayer,
    //   game.firstPlayerProgress.score,
    // );
    // return new GameViewModel(
    //   game.id,
    //   firstPlayerProgress,
    //   null,
    //   game.questions,
    //   game.status,
    //   game.pairCreatedDate.toISOString(),
    //   game.startGameDate ? game.startGameDate.toISOString() : null,
    //   game.finishGameDate ? game.finishGameDate.toISOString() : null,
    // );
  }
}
