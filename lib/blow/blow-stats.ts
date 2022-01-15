import { BlowGameView, BlowPlayerStats } from '../types/blow.types'
import { Dict } from '../types/object.types'
import { findManyBlowPlayerStatsByID } from './blow-player-stats-store'

export function initBlowPlayerStats(id: string): BlowPlayerStats {
  return {
    updated_at: new Date().toISOString(),
    id,
    g: 0,
    w: 0,
  }
}

export function sumBlowPlayerStats(
  a: BlowPlayerStats,
  b: BlowPlayerStats
): BlowPlayerStats {
  return Object.keys(a).reduce(
    (acc, key) => {
      const k = key as keyof BlowPlayerStats
      if (k !== 'id' && k !== 'updated_at') {
        acc[k] = (a[k] ?? 0) + (b[k] ?? 0)
      }
      return acc
    },
    { id: a.id, updated_at: new Date().toISOString() } as BlowPlayerStats
  )
}

type BlowPlayerStatsPair = [
  room: Dict<BlowPlayerStats>,
  total: Dict<BlowPlayerStats>
]

export async function updateBlowPlayerStats(
  game: BlowGameView
): Promise<BlowPlayerStatsPair> {
  // Get each player's all-time stats so we can update them
  const playerIDs = game.players.map((p) => p.id)
  const allTimeStats = await findManyBlowPlayerStatsByID(playerIDs)

  return game.players.reduce(
    (acc, player) => {
      const id = player.id
      const stats = initBlowPlayerStats(player.id)

      // If a win occurred, update players' match and win counts
      stats.g++

      if (game.winner?.id === id) {
        stats.w++
      }

      // Get player's existing room & all-time stats and add this round's
      const roomPlayerStats = game.stats?.[id] ?? initBlowPlayerStats(id)
      const allTimePlayerStats = allTimeStats[id] ?? initBlowPlayerStats(id)

      acc[0][id] = sumBlowPlayerStats(roomPlayerStats, stats)
      acc[1][id] = sumBlowPlayerStats(allTimePlayerStats, stats)

      return acc
    },
    [{}, {}] as BlowPlayerStatsPair
  )
}
