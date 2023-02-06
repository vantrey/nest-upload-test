import { StatisticGameView } from './statistic-game-view.dto';
import { PLayerViewModel } from './game-view.dto';

export class TopPlayerViewDto extends StatisticGameView {
  /**
   * Sum scores of all games //Сумма очков всех игр
   */
  public player: PLayerViewModel;

  constructor(
    sumScore: number,
    avgScores: number,
    gamesCount: number,
    winsCount: number,
    lossesCount: number,
    drawsCount: number,
    player: PLayerViewModel,
  ) {
    super(sumScore, avgScores, gamesCount, winsCount, lossesCount, drawsCount);
    this.player = player;
  }
}
