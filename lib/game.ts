import { getPlayersPerTeam } from './player'
import { CwdSettings } from './types/cwd.types'
import { FreqSettings } from './types/freq.types'
import { BaseGame, GameType, Player, TeamGuessGame } from './types/game.types'
import { createPropComparer } from './util/array'

type PartialGame = Partial<TeamGuessGame> & {
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
  game: BaseGame,
  type: GameType
): boolean {
  switch (type?.toLowerCase()) {
    case 'blow': {
      return (game.players ?? []).length >= 3
    }
    default:
    case 'cwd':
    case 'freq': {
      const teamGame = game as PartialGame
      if (teamGame.settings?.designated_psychic)
        return teamGame.psychic_1 != null || teamGame.psychic != null

      const requiredCount = type === 'cwd' ? 1 : 2
      const teams = getPlayersPerTeam(teamGame.players ?? [])
      return (
        teams[0].length >= requiredCount && teams[1].length >= requiredCount
      )
    }
  }
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

export const mostRecentGamesComparer = createPropComparer(
  (a: BaseGame) =>
    a.round_started_at ?? a?.match_started_at ?? a?.room_started_at,
  'desc'
)
