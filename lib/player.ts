import { Player } from '../types/player.types'
import { assignColor } from './color-dict'
import { randomIcon } from './icon'
import { randomName } from './name'

export function createPlayer(
  player_id: string,
  team?: 1 | 2,
  leader = false,
  existingPlayers?: Player[]
): Player {
  const name = randomName()
  const icon = randomIcon()
  let color: string | undefined
  if (team != null) {
    const existingColors = existingPlayers?.map((p) => p.color)
    color = assignColor(team, existingColors)
  }
  const player: Player = { player_id, name, icon, team, color, leader }
  return player
}
