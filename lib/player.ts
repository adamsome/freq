import { Player } from './types/game.types'
import { Dict } from './types/object.types'
import { User } from './types/user.types'
import { partition } from './util/array'
import { assignColor } from './color-dict'
import { randomIcon } from './icon'
import { randomName } from './name'
import { isObject } from './util/object'
import { isNotEmpty } from './util/string'

export function isPlayer(player: unknown): player is Player {
  return isObject(player) && isNotEmpty(player.id, player.name)
}

/** Same limits as the name input in `components/player-edit.tsx`. */
const PLAYER_NAME_MIN = 2
const PLAYER_NAME_MAX = 16
const PLAYER_ICON_MAX = 16

/**
 * Validates the editable fields of an `edit_player` command. Returns only
 * those fields so nothing else from the request body is written.
 */
export function parsePlayerEdit(value: unknown): {
  name: string
  icon?: string
} {
  if (!isObject(value)) throw new TypeError('Player edit requires an object.')
  const { name, icon } = value
  if (
    typeof name !== 'string' ||
    name.trim().length < PLAYER_NAME_MIN ||
    name.length > PLAYER_NAME_MAX
  ) {
    const range = `${PLAYER_NAME_MIN}–${PLAYER_NAME_MAX}`
    throw new TypeError(`Player name must be ${range} characters.`)
  }
  if (
    icon != null &&
    (typeof icon !== 'string' || icon.length > PLAYER_ICON_MAX)
  ) {
    throw new TypeError('Player icon must be a short string.')
  }
  return icon == null ? { name } : { name, icon }
}

interface CreatePlayerOptions {
  team?: 1 | 2
  leader?: boolean
  existingPlayers?: Player[]
  type?: User['type']
}

export function createPlayer(
  user: User,
  { team, leader = true, existingPlayers, type }: CreatePlayerOptions = {}
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
  if (type) {
    player.type = type
  }
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

interface AddPlayerOptions {
  team?: 1 | 2
  forceLeader?: boolean
  assignTeam?: boolean
  type?: User['type']
}

export function addPlayer(
  existingPlayers: Player[],
  user: User,
  { team, forceLeader = false, assignTeam, type }: AddPlayerOptions = {}
  // team: 1 | 2 = getPreferredTeam(players),
  // forceLeader = false
): Player[] {
  // Make leader if team has none
  const leader =
    forceLeader || !existingPlayers.some((p) => p.team === team && p.leader)

  if (team == null && assignTeam) {
    team = getPreferredTeam(existingPlayers)
  }

  // Return game w/ new player added
  const player = createPlayer(user, { team, leader, existingPlayers, type })
  return [...existingPlayers, player]
}

export function getPlayerDict<T extends Player>(players: T[]): Dict<T> {
  return players.reduce((acc, p) => {
    acc[p.id] = p
    return acc
  }, {} as Dict<T>)
}

export function findCurrentPlayerIndex<T extends Player>(
  players: T[],
  userID?: string
): number {
  if (!userID) return -1

  return players.findIndex((p) => p.id === userID)
}

export function findCurrentPlayer<T extends Player>(
  players: T[],
  userID?: string
): T | undefined {
  if (!userID) return

  const currentPlayerIndex = findCurrentPlayerIndex(players, userID)
  if (currentPlayerIndex >= 0) {
    return players[currentPlayerIndex]
  }
}
