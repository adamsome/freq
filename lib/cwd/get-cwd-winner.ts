import { CwdGame } from '../../types/cwd.types'

export default function getCwdWinner(game: CwdGame): 1 | 2 | undefined {
  if (game.score_team_1 === 0) return 1
  if (game.score_team_2 === 0) return 2
  if (game.last_act?.state === -1) return game.last_act.team === 1 ? 2 : 1
}
