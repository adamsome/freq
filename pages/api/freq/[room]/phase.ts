import type { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '../../../../lib/auth0'
import { updateFreqGamePath } from '../../../../lib/freq/freq-game-store'
import getRoomUser from '../../../../lib/get-room-user'
import { FREQ_PHASES } from '../../../../lib/types/freq.types'

export default auth0.withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const roomUser = await getRoomUser(req)

        if (roomUser.status === 'error') {
          return res.status(401).json({ message: roomUser.error })
        }

        const { room, user } = roomUser

        // Debug tool (team-debug-bar): skips all phase rules, so admins only.
        if (user.type !== 'admin') {
          return res.status(403).json({ message: 'Admins only.' })
        }

        const phase = req.body?.phase
        if (!(FREQ_PHASES as readonly unknown[]).includes(phase)) {
          return res.status(400).json({ message: 'Valid phase required.' })
        }

        await updateFreqGamePath(room, 'phase', phase)
        return res.json(true)
      } catch (error) {
        const { response } = error
        return res.status(response?.status || 500).json(error.data)
      }
    }
    return res.status(404).send('')
  }
)
