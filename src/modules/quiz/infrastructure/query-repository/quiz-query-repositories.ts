import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameStatusesType } from '../../../../entities/game.entity';
import { Player } from '../../../../entities/player.entity';
import { Question } from '../../../../entities/question.entity';
import { Answer } from '../../../../entities/answer.entity';
import { AnswerViewModel, GamePlayerProgressViewModel, GameViewModel, PLayerViewModel } from './game-view.dto';
import { QuestionViewModel } from '../../../sa/infrastructure/query-reposirory/question-for-sa-view.dto';
import { PaginationViewDto } from '../../../../common/pagination-View.dto';
import { PaginationQuizDto } from '../../api/input-dtos/pagination-quiz.dto';
import { StatisticGameView } from './statistic-game-view.dto';

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

  private mappedQuestionForView(question: Question): QuestionViewModel {
    return new QuestionViewModel(question.id, question.body);
  }

  private async mappedGameForView(game: Game): Promise<GameViewModel> {
    const firstPlayer = new PLayerViewModel(game.firstPlayerProgress.userId, game.firstPlayerProgress.login);
    const answersFirstPlayer = await this.answerRepo.find({
      select: ['questionId', 'answerStatus', 'addedAt'],
      where: { playerId: game.firstPlayerProgress.id, gameId: game.id },
      order: { addedAt: 'ASC' },
    });
    const answersSecondPlayer = await this.answerRepo.find({
      select: ['questionId', 'answerStatus', 'addedAt'],
      where: { playerId: game.secondPlayerProgress.id, gameId: game.id },
      order: { addedAt: 'ASC' },
    });
    const questions = await Promise.all(
      game.questions.sort((a, b) => Number(a.createdAt) - Number(b.createdAt)).map((q) => this.mappedQuestionForView(q)),
    );
    const secondPlayer = new PLayerViewModel(game.secondPlayerProgress.userId, game.secondPlayerProgress.login);
    const firstPlayerProgress = new GamePlayerProgressViewModel(
      answersFirstPlayer.map((a) => this.mappedAnswerForView(a)),
      firstPlayer,
      game.firstPlayerProgress.score,
    );
    const secondPlayerProgress = new GamePlayerProgressViewModel(
      answersSecondPlayer.map((a) => this.mappedAnswerForView(a)),
      secondPlayer,
      game.secondPlayerProgress.score,
    );
    return new GameViewModel(
      game.id,
      firstPlayerProgress,
      secondPlayerProgress,
      questions,
      game.status,
      game.pairCreatedDate.toISOString(),
      game.startGameDate ? game.startGameDate.toISOString() : null,
      game.finishGameDate ? game.finishGameDate.toISOString() : null,
    );
  }

  async findCurrentGame(userId: string): Promise<GameViewModel> {
    const game = await this.gameRepo.findOne({
      relations: {
        firstPlayerProgress: true,
        secondPlayerProgress: true,
        questions: true,
      },
      where: [
        {
          status: GameStatusesType.Active,
          firstPlayerId: userId,
        },
        {
          status: GameStatusesType.Active,
          secondPlayerId: userId,
        },
        {
          status: GameStatusesType.PendingSecondPlayer,
          firstPlayerId: userId,
        },
      ],
    });
    if (!game.secondPlayerProgress) {
      return await this.mappedFirstPlayerForView(game.id);
    }
    return await this.mappedGameForView(game);
  }

  async getGameById(userId: string, id: string): Promise<GameViewModel> {
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

  async mappedFirstPlayerForView(gameId: string): Promise<GameViewModel> {
    const game = await this.gameRepo.findOne({
      select: [],
      relations: { firstPlayerProgress: true, secondPlayerProgress: true, questions: true },
      where: { id: gameId },
    });
    // return this.mappedGameForView(game);
    const firstPlayer = new PLayerViewModel(game.firstPlayerProgress.userId, game.firstPlayerProgress.login);
    const answersFirstPlayer = await Promise.all(game.firstPlayerProgress.answers.map((a) => this.mappedAnswerForView(a)));
    const firstPlayerProgress = new GamePlayerProgressViewModel(answersFirstPlayer, firstPlayer, game.firstPlayerProgress.score);
    return new GameViewModel(
      game.id,
      firstPlayerProgress,
      null,
      null,
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
  }

  async getGames(userId: string, data: PaginationQuizDto): Promise<PaginationViewDto<GameViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = data;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }

    const [games, count] = await Promise.all([
      this.gameRepo.find({
        select: [],
        relations: {
          firstPlayerProgress: true,
          secondPlayerProgress: true,
          questions: true,
        },
        where: [{ firstPlayerId: userId }, { secondPlayerId: userId }],
        order: { [sortBy]: order, pairCreatedDate: 'DESC' },
        skip: data.skip,
        take: pageSize,
      }),
      this.gameRepo.count({ where: [{ firstPlayerId: userId }, { secondPlayerId: userId }] }),
    ]);
    const mappedGames = games.map((game) => this.mappedGameForView(game));
    const items = await Promise.all(mappedGames);
    const pagesCountRes = Math.ceil(count / pageSize);
    return new PaginationViewDto(pagesCountRes, pageNumber, pageSize, count, items);
  }

  async getStatistic(userId: string) {
    const [res] = await Promise.all([
      this.playerRepo
        .createQueryBuilder('p')
        .select('SUM(p.score)', 'sumScore')
        .addSelect('AVG(p.score)', 'avgScores')
        .addSelect('COUNT(*)', 'gamesCount')
        .addSelect('SUM(p.winScore)', 'winsCount')
        .addSelect('SUM(p.lossScore)', 'lossesCount')
        .addSelect('SUM(p.drawScore)', 'drawsCount')
        .where('p.userId = :userId', { userId })
        .getRawOne(),
    ]);
    return new StatisticGameView(
      +res.sumScore,
      +Number(res.avgScores).toFixed(2),
      +res.gamesCount,
      +res.winsCount,
      +res.lossesCount,
      +res.drawsCount,
    );
  }
}
