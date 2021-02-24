import { NextApiRequest, NextApiResponse } from 'next'
import { updateGamePath } from '../../../../lib/game-store'
import { isRoomValid } from '../../../../lib/room'
import { head } from '../../../../util/array'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const body = await req.body
      const phase = body?.phase
      const room = head(req.query?.room)?.toLowerCase()

      if (!phase) {
        return res.status(500).end('Phase required.')
      }

      if (!isRoomValid(room)) {
        return res.status(500).end('Room invalid.')
      }

      await updateGamePath(room, 'phase', phase)
      return res.json(true)
    } catch (error) {
      const { response } = error
      return res.status(response?.status || 500).json(error.data)
    }
  }
  return res.status(404).send('')
}
