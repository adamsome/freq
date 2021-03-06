import { CwdSettings } from '../types/cwd.types'
import { FreqSettings } from '../types/freq.types'
import { CommonGame, GameType, Player } from '../types/game.types'
import { getPlayersPerTeam } from './player'

type PartialGame = CommonGame & {
  players: Player[]
  settings?: CwdSettings | FreqSettings
  psychic?: string
  psychic_1?: string
}

export function getGameTitle(type: GameType | string | undefined) {
  switch (type?.toLowerCase()) {
    case 'cwd':
      return 'Cwd'
    case 'freq':
      return 'Freq'
  }
}

export function doesGameHaveEnoughPlayers(game: PartialGame, type: GameType) {
  if (game.settings?.designated_psychic)
    return game.psychic_1 != null || game.psychic != null

  const requiredCount = type === 'cwd' ? 1 : 2
  const teams = getPlayersPerTeam(game.players)
  return teams[0].length >= requiredCount && teams[1].length >= requiredCount
}

export function getTeamName(team?: 1 | 2): string {
  switch (team) {
    case 1:
      return 'Red'
    case 2:
      return 'Blue'
    default:
      return 'Audience'
  }
}
