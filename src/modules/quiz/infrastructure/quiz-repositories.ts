import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameStatusesType } from '../../../entities/game.entity';
import { Player } from '../../../entities/player.entity';
import { Question } from '../../../entities/question.entity';
import { Answer, AnswerStatusesType } from '../../../entities/answer.entity';

export class QuizRepositories {
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>,
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async saveGame(createdGame: Game): Promise<Game> {
    return this.gameRepo.save(createdGame);
  }

  async savePlayer(createdPlayer: Player): Promise<Player> {
    return this.playerRepo.save(createdPlayer);
  }

  async saveAnswer(createdAnswer: Answer): Promise<Answer> {
    return this.answerRepo.save(createdAnswer);
  }

  async findPendingGame(): Promise<Game> {
    const game = await this.gameRepo.findOne({
      where: { status: GameStatusesType.PendingSecondPlayer },
    });
    if (!game) return null;
    return game;
  }

  async findPendingGameByUserId(userId: string): Promise<boolean> {
    const game = await this.gameRepo.findOne({
      select: ['id'],
      where: {
        status: GameStatusesType.PendingSecondPlayer,
        firstPlayerId: userId,
      },
    });
    if (!game) return null;
    return true;
  }

  async findActiveGameByUserId(userId: string): Promise<Game> {
    const game = await this.gameRepo.findOne({
      select: [],
      relations: { firstPlayerProgress: true, secondPlayerProgress: true, questions: true },
      where: [
        { status: GameStatusesType.Active, firstPlayerId: userId },
        { status: GameStatusesType.Active, secondPlayerId: userId },
      ],
    });
    if (!game) return null;
    return game;
  }

  async findQuestions(): Promise<Question[]> {
    return this.questionRepo.find({
      select: ['id', 'body'],
      where: { published: true },
      take: 5,
    });
    // .createQueryBuilder('q')
    // .select(['q.id, q.body'])
    // .orderBy('RANDOM()')
    // .take(5)
    // .getMany();
  }

  async findActiveGameByIdGame(id: string): Promise<boolean> {
    const game = await this.gameRepo.findOne({
      select: ['id'],
      where: [{ id: id, status: GameStatusesType.Active }],
    });
    if (!game) return null;
    return true;
  }

  async findFinishedGameByIdGameAndUserId(id: string, userId: string): Promise<Game> {
    const game = await this.gameRepo.findOne({
      select: ['id', 'questions'],
      where: [
        { id: id, status: GameStatusesType.Finished, firstPlayerId: userId },
        { id: id, status: GameStatusesType.Finished, secondPlayerId: userId },
      ],
    });
    if (!game) return null;
    return game;
  }

  async countingAnswers(userId: string, gameId: string): Promise<number> {
    return this.answerRepo.count({
      where: { playerId: userId, gameId: gameId },
    });
  }

  async findPlayer(userId: string, gameId: string): Promise<Player> {
    return this.playerRepo.findOne({
      relations: { answers: true },
      where: { id: userId, gameId: gameId },
    });
  }

  async countSuccessAnswers(userId: string, gameId: string): Promise<number> {
    return this.answerRepo.count({
      where: { playerId: userId, gameId: gameId, answerStatus: AnswerStatusesType.Correct },
    });
  }
}
