export enum columns {
  sumScore = 'SUM(p.score)',
  avgScores = 'AVG(p.score)',
  gamesCount = 'COUNT(*)',
  winsCount = 'SUM(p.winScore)',
  lossesCount = 'SUM(p.lossScore)',
  drawsCount = 'SUM(p.drawScore)',
}
