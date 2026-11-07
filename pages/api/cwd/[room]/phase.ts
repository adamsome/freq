import type { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '../../../../lib/auth0'
import { updateCwdGamePath } from '../../../../lib/cwd/cwd-game-store'
import getRoomUser from '../../../../lib/get-room-user'

export default auth0.withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const roomUser = await getRoomUser(req)

        if (roomUser.status === 'error') {
          return res.status(401).json({ message: roomUser.error })
        }

        const phase = req.body?.phase

        if (!phase) {
          res.status(500).end('Phase required.')
          return
        }

        // TODO: Validate phase value
        await updateCwdGamePath(roomUser.room, 'phase', phase)
        return res.json(true)
      } catch (error) {
        const { response } = error
        return res.status(response?.status || 500).json(error.data)
      }
    }
    return res.status(404).send('')
  }
)
