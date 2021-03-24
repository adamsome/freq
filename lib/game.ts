import { Player } from '../types/game.types'
import { getPlayersPerTeam } from './player'

export function doesGameHaveEnoughPlayers(game: { players: Player[] }) {
  const teams = getPlayersPerTeam(game.players)
  return teams[0].length > 1 && teams[1].length > 1
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
