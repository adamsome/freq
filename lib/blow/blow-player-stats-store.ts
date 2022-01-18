import { Db, OptionalUnlessRequiredId } from 'mongodb'
import { BlowPlayerStats } from '../types/blow.types'
import { Dict } from '../types/object.types'
import { connectToDatabase } from '../util/mongodb'

export const fromBlowPlayerStats = (db: Db) =>
  db.collection<OptionalUnlessRequiredId<BlowPlayerStats>>('blow_player_stats')

export async function findManyBlowPlayerStatsByID(
  playerIDs: string[]
): Promise<Dict<BlowPlayerStats>> {
  const { db } = await connectToDatabase()

  const stats = await fromBlowPlayerStats(db)
    .find({ id: { $in: playerIDs } })
    .toArray()

  return stats.reduce((acc, statsRecord) => {
    const playerStats: OptionalUnlessRequiredId<BlowPlayerStats> = {
      ...statsRecord,
    }
    delete playerStats._id
    acc[playerStats.id] = playerStats
    return acc
  }, {} as Dict<BlowPlayerStats>)
}

export async function upsertManyBlowPlayerStatsByID(
  playerStats: Dict<BlowPlayerStats>
): Promise<void> {
  const { db } = await connectToDatabase()

  const playerIDs = Object.keys(playerStats)
  await Promise.all(
    playerIDs.map((id) =>
      fromBlowPlayerStats(db).updateOne(
        { id },
        { $set: playerStats[id] },
        { upsert: true }
      )
    )
  )
}
