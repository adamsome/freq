import { NextApiResponse } from 'next'
import { fetchGame } from '../../lib/game-store'
import { toGameView } from '../../lib/game-view'
import { isRoomValid } from '../../lib/room'
import { RequestWithSession } from '../../types/io.types'
import withSession from '../../util/with-session'

export default withSession(
  async (req: RequestWithSession, res: NextApiResponse) => {
    if (req.method === 'GET') {
      const user = req.session.get('user')

      if (!user || !user.connected) {
        const msg = 'Cannot fetch game with no user session.'
        return res.status(500).json(new Error(msg))
      }

      const room = user.room

      if (!isRoomValid(room)) {
        const msg = 'Cannot fetch game with invalid room.'
        return res.status(500).json(new Error(msg))
      }

      const game = await fetchGame(room)

      if (!game) {
        const msg = 'Cannot fetch non-existant game.'
        return res.status(500).json(new Error(msg))
      }

      return res.json(toGameView(user.id, game))
    }
    return res.status(404).send('')
  }
)
