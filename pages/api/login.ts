import { NextApiResponse } from 'next'
import { isRoomValid } from '../../lib/room'
import { RequestWithSession } from '../../types/io.types'
import withSession, { createUserSession } from '../../util/with-session'

export default withSession(
  async (req: RequestWithSession, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const body = await req.body
      const room = body.room

      if (!isRoomValid(room)) {
        const message = 'Cannot login with invalid room.'
        return res.status(500).json({ message })
      }

      try {
        const user = await createUserSession(req, room)
        return res.json(user)
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
