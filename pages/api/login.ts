import { NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import { isRoomValid } from '../../lib/game'
import { RequestWithSession } from '../../types/io.types'
import { User } from '../../types/user.types'
import withSession from '../../util/with-session'

export default withSession(
  async (req: RequestWithSession, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const body = await req.body
      const room = body.room
      const id = uuidv4()

      if (!isRoomValid(room)) {
        res.status(500).json(new Error('Cannot login with invalid room.'))
      }

      try {
        const user: User = { connected: true, room, id }
        req.session.set('user', user)
        await req.session.save()
        return res.json(user)
      } catch (error) {
        const { response } = error
        return res.status(response?.status || 500).json(error.data)
      }
    }
    return res.status(404).send('')
  }
)
