import { NextApiResponse } from 'next'
import { updateGamePhase } from '../../lib/game-store'
import { RequestWithSession } from '../../types/io.types'
import withSession from '../../util/with-session'

export default withSession(
  async (req: RequestWithSession, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const user = req.session.get('user')

        if (!user || !user.connected) {
          const msg = 'Cannot fetch game with no user session.'
          return res.status(500).json(new Error(msg))
        }

        const body = await req.body
        await updateGamePhase(user.room, body.phase)
        return res.json(true)
      } catch (error) {
        const { response } = error
        return res.status(response?.status || 500).json(error.data)
      }
    }
    return res.status(404).send('')
  }
)
