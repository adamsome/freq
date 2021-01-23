import { NextApiRequest, NextApiResponse } from 'next'
import { fetchGame } from '../../../lib/game-store'
import { head } from '../../../util/array'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const room = head(query.room)
  const game = await fetchGame(room)
  res.json(game)
}
