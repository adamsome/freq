import { CwdSettings } from './types/cwd.types'
import { FreqSettings } from './types/freq.types'
import { TeamGuessGame, GameType, Player, BaseGame } from './types/game.types'
import { getPlayersPerTeam } from './player'

type PartialGame = TeamGuessGame & {
  players: Player[]
  settings?: CwdSettings | FreqSettings
  psychic?: string
  psychic_1?: string
}

export function getGameTitle(
  type: GameType | string | undefined
): string | undefined {
  switch (type?.toLowerCase()) {
    case 'cwd':
      return 'Cwd'
    case 'freq':
      return 'Freq'
    case 'blow':
      return 'Blow'
  }
}

export function isTeamGuessGame(type: GameType | string | undefined): boolean {
  switch (type?.toLowerCase()) {
    case 'cwd':
    case 'freq':
      return true
    case 'blow':
    default:
      return false
  }
}

export function shouldUsePlayerIcon(
  type: GameType | string | undefined
): boolean {
  switch (type?.toLowerCase()) {
    case 'blow':
      return false
    case 'cwd':
    case 'freq':
    default:
      return true
  }
}

export function doesGameHaveEnoughPlayers(
  game: PartialGame,
  type: GameType
): boolean {
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

export function mostRecentGamesComparer(a: BaseGame, b: BaseGame): -1 | 0 | 1 {
  const aa = a.round_started_at ?? a?.match_started_at ?? a?.room_started_at
  const bb = b.round_started_at ?? b?.match_started_at ?? b?.room_started_at

  return aa < bb ? 1 : aa > bb ? -1 : 0
}
