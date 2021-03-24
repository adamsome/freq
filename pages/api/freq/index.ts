import { NextApiRequest, NextApiResponse } from 'next'
import { FreqGame } from '../../../types/freq.types'
import { connectToDatabase } from '../../../util/mongodb'

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDatabase()

  const games = await db
    .collection<FreqGame>('games')
    .find({})
    .sort({ room: -1 })
    .limit(20)
    .toArray()

  res.json(games)
}
