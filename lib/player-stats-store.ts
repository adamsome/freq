import { Db, OptionalId, WithId } from 'mongodb'
import { PlayerStats } from '../types/game.types'
import { Dict } from '../types/object.types'
import { connectToDatabase } from '../util/mongodb'

export const fromPlayerStats = (db: Db) =>
  db.collection<WithId<PlayerStats>>('player_stats')

export async function findManyPlayerStatsByID(
  playerIDs: string[]
): Promise<Dict<PlayerStats>> {
  const { db } = await connectToDatabase()

  const stats = await fromPlayerStats(db)
    .find({ id: { $in: playerIDs } })
    .toArray()

  return stats.reduce((acc, statsRecord) => {
    const playerStats: OptionalId<WithId<PlayerStats>> = { ...statsRecord }
    delete playerStats._id
    acc[playerStats.id] = playerStats
    return acc
  }, {} as Dict<PlayerStats>)
}

export async function upsertManyPlayerStatsByID(
  playerStats: Dict<PlayerStats>
): Promise<void> {
  const { db } = await connectToDatabase()

  const playerIDs = Object.keys(playerStats)
  await Promise.all(
    playerIDs.map((id) =>
      fromPlayerStats(db).updateOne(
        { id },
        { $set: playerStats[id] },
        { upsert: true }
      )
    )
  )
}
