export class StatisticGameView {
  /**
   * Sum scores of all games //Сумма очков всех игр
   */
  public sumScore: number;
  /**
   * Average score of all games rounded to 2 decimal places //Средний балл по всем играм округлен до 2 знаков после
   */
  public avgScores: number;
  /**
   * All played games count //Учитываются все сыгранные игры
   */
  public gamesCount: number;
  public winsCount: number;
  public lossesCount: number;
  public drawsCount: number;

  constructor(
    sumScore: number,
    avgScores: number,
    gamesCount: number,
    winsCount: number,
    lossesCount: number,
    drawsCount: number,
  ) {
    this.sumScore = sumScore;
    this.avgScores = avgScores;
    this.gamesCount = gamesCount;
    this.winsCount = winsCount;
    this.lossesCount = lossesCount;
    this.drawsCount = drawsCount;
  }
}
