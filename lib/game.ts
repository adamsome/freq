import { CwdSettings } from '../types/cwd.types'
import { GameType, Player } from '../types/game.types'
import { getPlayersPerTeam } from './player'

interface HasPlayers {
  players: Player[]
  settings?: CwdSettings
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

export function doesGameHaveEnoughPlayers(game: HasPlayers) {
  if (game.settings?.designated_psychic) return game.psychic_1 != null

  const teams = getPlayersPerTeam(game.players)
  return teams[0].length >= 1 && teams[1].length >= 1
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
