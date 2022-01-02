import { Db, OptionalId, WithId } from 'mongodb'
import { CwdPlayerStats } from '../types/cwd.types'
import { Dict } from '../types/object.types'
import { connectToDatabase } from '../util/mongodb'

export const fromCwdPlayerStats = (db: Db) =>
  db.collection<WithId<CwdPlayerStats>>('player_stats')

export async function findManyCwdPlayerStatsByID(
  playerIDs: string[]
): Promise<Dict<CwdPlayerStats>> {
  const { db } = await connectToDatabase()

  const stats = await fromCwdPlayerStats(db)
    .find({ id: { $in: playerIDs } })
    .toArray()

  return stats.reduce((acc, statsRecord) => {
    const playerStats: OptionalId<WithId<CwdPlayerStats>> = { ...statsRecord }
    delete playerStats._id
    acc[playerStats.id] = playerStats
    return acc
  }, {} as Dict<CwdPlayerStats>)
}

export async function upsertManyCwdPlayerStatsByID(
  playerStats: Dict<CwdPlayerStats>
): Promise<void> {
  const { db } = await connectToDatabase()

  const playerIDs = Object.keys(playerStats)
  await Promise.all(
    playerIDs.map((id) =>
      fromCwdPlayerStats(db).updateOne(
        { id },
        { $set: playerStats[id] },
        { upsert: true }
      )
    )
  )
}
