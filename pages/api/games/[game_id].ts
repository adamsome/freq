import { NextApiRequest, NextApiResponse } from 'next'
import { Game } from '../../../types/game.model'
import { connectToDatabase } from '../../../util/mongodb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDatabase()

  const { query } = req
  const game_id = Array.isArray(query.game_id)
    ? query.game_id[0]
    : query.game_id

  const game = await db.collection<Game>('games').findOne({ game_id })

  res.json(game)
}
