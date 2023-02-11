import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, LessThanOrEqual, Repository } from 'typeorm';
import { Game, GameStatusesType } from '../../../entities/game.entity';
import { Player } from '../../../entities/player.entity';
import { Question } from '../../../entities/question.entity';
import { Answer } from '../../../entities/answer.entity';

export class QuizRepositories {
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>,
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}
  //save
  async saveGame(createdGame: Game, manager?: EntityManager): Promise<Game> {
    return manager ? manager.getRepository(Game).save(createdGame) : this.gameRepo.save(createdGame);
    // if (manager) {
    //   return manager.getRepository(Game).save(createdGame);
    // }
    // return this.gameRepo.save(createdGame);
  }

  async savePlayer(createdPlayer: Player, manager?: EntityManager): Promise<Player> {
    return manager ? manager.getRepository(Player).save(createdPlayer) : this.playerRepo.save(createdPlayer);
    // if (manager) {
    //   return manager.getRepository(Player).save(createdPlayer);
    // }
    // return this.playerRepo.save(createdPlayer);
  }

  //get
  async findCurrentGame(userId: string): Promise<Game> {
    return await this.gameRepo.findOne({
      select: ['id', 'status'],
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
    // .catch((e) => {
    //   return null;
    // });
    // console.log(games);
    // if (games.length === 0) return null;
    // return true;
  }

  async findGame(gameId: string): Promise<Game> {
    const game = await this.gameRepo.findOne({
      select: [],
      relations: { firstPlayerProgress: true, secondPlayerProgress: true, questions: true },
      where: { id: gameId },
    });
    if (!game) return null;
    return game;
  }

  //connection
  async findPendingGame(): Promise<Game> {
    const game = await this.gameRepo.findOne({
      where: { status: GameStatusesType.PendingSecondPlayer },
    });
    if (!game) return null;
    return game;
  }

  async findActiveAndPendingGameByUserId(userId: string): Promise<Game> {
    const game = await this.gameRepo.findOne({
      select: [],
      relations: { firstPlayerProgress: true, secondPlayerProgress: true, questions: true },
      where: [
        { status: GameStatusesType.Active, firstPlayerId: userId },
        { status: GameStatusesType.PendingSecondPlayer, firstPlayerId: userId },
        { status: GameStatusesType.Active, secondPlayerId: userId },
      ],
    });
    if (!game) return null;
    return game;
  }

  async findQuestions(): Promise<Question[]> {
    return this.questionRepo
      .createQueryBuilder('q')
      .select('q.id, q.body')
      .where('q.published = true')
      .orderBy('RANDOM ()')
      .take(5)
      .addOrderBy('q.updatedAt', 'ASC')
      .getRawMany();
  }

  //answer
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

  //alternative -- answer with manager, for concurrent game
  async findPlayerManager(userId: string, gameId: string, manager?: EntityManager): Promise<Player> {
    return await manager
      .getRepository(Player)
      .createQueryBuilder('p')
      .setLock('pessimistic_write', undefined, ['p'])
      .leftJoinAndSelect('p.answers', 'playerAnswers')
      .where('p.userId = :userId AND p.gameId = :gameId AND p.statusesPlayer = false', { userId: userId, gameId: gameId })
      .getOne();
  }

  async findActiveGameByUserIdManager(userId: string, manager?: EntityManager): Promise<Game> {
    const game = await manager
      .getRepository(Game)
      .createQueryBuilder('g')
      .setLock('pessimistic_write', undefined, ['g'])
      .innerJoinAndSelect('g.questions', 'q')
      .innerJoinAndSelect('g.firstPlayerProgress', 'firstPlayerProgress')
      .leftJoinAndSelect('firstPlayerProgress.answers', 'firstAnswers')
      .innerJoinAndSelect('g.secondPlayerProgress', 'secondPlayerProgress')
      .leftJoinAndSelect('secondPlayerProgress.answers', 'secondAnswers')
      .where('g.status = :gameStatus AND g.firstPlayerId = :userId', { gameStatus: GameStatusesType.Active, userId: userId })
      .orWhere('g.status = :gameStatus AND g.firstPlayerId = :userId', { gameStatus: GameStatusesType.Active, userId: userId })
      .getOne();
    if (!game) return null;
    return game;
  }

  async findPlayerForAddBonusPointManager(userId: string, gameId: string, manager?: EntityManager): Promise<Player> {
    return await manager
      .getRepository(Player)
      .createQueryBuilder('p')
      .setLock('pessimistic_write', undefined, ['p'])
      .leftJoinAndSelect('p.answers', 'playerAnswers')
      .where('p.userId = :userId AND p.gameId = :gameId', { userId: userId, gameId: gameId })
      .getOne();
  }

  async forcedFinishGame(): Promise<Game[]> {
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const games = await this.gameRepo.find({
      select: [],
      relations: { firstPlayerProgress: true, secondPlayerProgress: true, questions: true },
      where: [{ status: GameStatusesType.Active, finishedOnePlayer: LessThanOrEqual(tenSecondsAgo) }],
    });
    if (games.length === 0) return null;
    return games;
  }
}
