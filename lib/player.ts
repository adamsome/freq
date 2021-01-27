import { Player } from '../types/game.types'
import { partition } from '../util/array'
import { assignColor } from './color-dict'
import { randomIcon } from './icon'
import { randomName } from './name'

export function createPlayer(
  id: string,
  team?: 1 | 2,
  leader = false,
  existingPlayers?: Player[]
): Player {
  const existingNames = existingPlayers?.map((p) => p.name ?? '')
  const name = randomName(existingNames)
  const icon = randomIcon()
  let color: string | undefined
  if (team != null) {
    const existingColors = existingPlayers?.map((p) => p.color)
    color = assignColor(team, existingColors)
  }
  const player: Player = { id, name, icon, team, color, leader }
  return player
}

export function getPlayersPerTeam(players: Player[]): [Player[], Player[]] {
  const [, teamPlayers] = partition((p) => p.team == null, players)
  return partition((p) => p.team === 1, teamPlayers)
}

export function getTeamPlayers(
  players: Player[],
  team: 1 | 2 | undefined,
  ...ignorePlayers: (string | { id: string })[]
): Player[] {
  const ignoreIDs = ignorePlayers.map((p) => (typeof p === 'string' ? p : p.id))
  return players
    .filter((p) => p.team === team)
    .filter((p) => !ignoreIDs.includes(p.id))
}
