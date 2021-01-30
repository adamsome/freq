import { NextApiResponse } from 'next'
import { fetchGame } from '../../lib/game-store'
import { toGameView } from '../../lib/game-view'
import { isRoomValid } from '../../lib/room'
import { RequestWithSession } from '../../types/io.types'
import withSession from '../../util/with-session'

export default withSession(
  async (req: RequestWithSession, res: NextApiResponse) => {
    if (req.method === 'GET') {
      try {
        const user = req.session.get('user')

        if (!user || !user.connected) {
          const message = 'Cannot fetch game state with no user session.'
          return res.status(500).json({ message })
        }

        const room = user.room

        if (!isRoomValid(room)) {
          const message = 'Cannot fetch game with invalid room.'
          return res.status(500).json({ message })
        }

        const game = await fetchGame(room)

        if (!game) {
          const message = 'Cannot fetch non-existant game.'
          return res.status(500).json({ message })
        }

        return res.json(toGameView(user.id, game))
      } catch (error) {
        const { response } = error
        return res
          .status(response?.status || 500)
          .json(error.data ?? { message: error.message })
      }
    }
    return res.status(404).send('')
  }
)
