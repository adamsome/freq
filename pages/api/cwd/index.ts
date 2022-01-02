import { NextApiRequest, NextApiResponse } from 'next'
import { FreqGame } from '../../../lib/types/freq.types'
import { connectToDatabase } from '../../../lib/util/mongodb'

export default async function getCwdRooms(
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { db } = await connectToDatabase()

  const games = await db
    .collection<FreqGame>('cwd_games')
    .find({})
    .sort({ room: -1 })
    .limit(20)
    .toArray()

  res.json(games)
}
