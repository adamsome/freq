import { NextApiRequest, NextApiResponse } from 'next'
import { fetchGame } from '../../../lib/game'
import { head } from '../../../util/array'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const game_id = head(query.game_id)
  const game = await fetchGame(game_id)
  res.json(game)
}
