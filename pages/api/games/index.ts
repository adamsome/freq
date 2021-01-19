import { NextApiRequest, NextApiResponse } from 'next'
import { Game } from '../../../types/game.model'
import { connectToDatabase } from '../../../util/mongodb'

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDatabase()

  const games = await db
    .collection<Game>('games')
    .find({})
    .sort({ game_id: -1 })
    .limit(20)
    .toArray()

  res.json(games)
}
