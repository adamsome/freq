import { Db, OptionalUnlessRequiredId } from 'mongodb'
import { FreqPlayerStats } from '../types/freq.types'
import { Dict } from '../types/object.types'
import { connectToDatabase } from '../util/mongodb'

export const fromFreqPlayerStats = (db: Db) =>
  db.collection<OptionalUnlessRequiredId<FreqPlayerStats>>('player_stats')

export async function findManyFreqPlayerStatsByID(
  playerIDs: string[]
): Promise<Dict<FreqPlayerStats>> {
  const { db } = await connectToDatabase()

  const stats = await fromFreqPlayerStats(db)
    .find({ id: { $in: playerIDs } })
    .toArray()

  return stats.reduce((acc, statsRecord) => {
    const playerStats: OptionalUnlessRequiredId<FreqPlayerStats> = {
      ...statsRecord,
    }
    delete playerStats._id
    acc[playerStats.id] = playerStats
    return acc
  }, {} as Dict<FreqPlayerStats>)
}

export async function upsertManyFreqPlayerStatsByID(
  playerStats: Dict<FreqPlayerStats>
): Promise<void> {
  const { db } = await connectToDatabase()

  const playerIDs = Object.keys(playerStats)
  await Promise.all(
    playerIDs.map((id) =>
      fromFreqPlayerStats(db).updateOne(
        { id },
        { $set: playerStats[id] },
        { upsert: true }
      )
    )
  )
}
