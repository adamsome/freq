import { Player } from '../types/game.types'
import { Dict } from '../types/object.types'
import { User } from '../types/user.types'
import { partition } from '../util/array'
import { assignColor } from './color-dict'
import { randomIcon } from './icon'
import { randomName } from './name'

export function isPlayer(player: any): player is Player {
  return player.id && player.name
}

export function createPlayer(
  user: User,
  team?: 1 | 2,
  leader = false,
  existingPlayers?: Player[]
): Player {
  const id = user.id
  const existingNames = existingPlayers?.map((p) => p.name ?? '')
  const name = user.name ?? randomName(existingNames)
  const icon = user.icon ?? randomIcon()
  let color: string | undefined
  if (team != null) {
    const existingColors = existingPlayers?.map((p) => p.color)
    color = assignColor(team, existingColors)
  }
  const player: Player = { id, name, icon, team, color, leader }
  return player
}

export function getPlayersPerTeam<T extends Player>(players: T[]): [T[], T[]] {
  const [, teamPlayers] = partition((p) => p.team == null, players)
  return partition((p) => p.team === 1, teamPlayers)
}

export function getTeamPlayers<T extends Player>(
  players: T[],
  team: 1 | 2 | undefined,
  ...ignorePlayers: (string | { id: string })[]
): T[] {
  const ignoreIDs = ignorePlayers.map((p) => (typeof p === 'string' ? p : p.id))
  return players
    .filter((p) => p.team === team)
    .filter((p) => !ignoreIDs.includes(p.id))
}

export function hasPlayer<T extends Player>(players: T[], userID: string) {
  return players.some((p) => p.id === userID)
}

/**
 * Get count of players on each team (index 0 indicates no team)
 */
function getPlayerCountByTeam(players: Player[]): number[] {
  return players.reduce((acc, p) => {
    const t = p.team ?? 0
    acc[t] = (acc[t] ?? 0) + 1
    return acc
  }, [] as number[])
}

export function getPreferredTeam(players: Player[]): 1 | 2 {
  const countByTeam = getPlayerCountByTeam(players)
  // Put new player on the smallest team
  return (countByTeam[1] ?? 0) > (countByTeam[2] ?? 0) ? 2 : 1
}

export function addPlayer(
  players: Player[],
  user: User,
  team: 1 | 2 = getPreferredTeam(players),
  forceLeader = false
): Player[] {
  // Make leader if team has none
  const leader =
    forceLeader || !players.some((p) => p.team === team && p.leader)

  // Return game w/ new player added
  const player = createPlayer(user, team, leader, players)
  return [...players, player]
}

export function getPlayerDict<T extends Player>(players: T[]): Dict<T> {
  return players.reduce((acc, p) => {
    acc[p.id] = p
    return acc
  }, {} as Dict<T>)
}
