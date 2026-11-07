import type { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '../../../../lib/auth0'
import { updateCwdGamePath } from '../../../../lib/cwd/cwd-game-store'
import getRoomUser from '../../../../lib/get-room-user'
import { CWD_PHASES } from '../../../../lib/types/cwd.types'

export default auth0.withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const roomUser = await getRoomUser(req)

        if (roomUser.status === 'error') {
          return res.status(401).json({ message: roomUser.error })
        }

        // Debug tool (team-debug-bar): skips all phase rules, so admins only.
        if (roomUser.user.type !== 'admin') {
          return res.status(403).json({ message: 'Admins only.' })
        }

        const phase = req.body?.phase
        if (!(CWD_PHASES as readonly unknown[]).includes(phase)) {
          return res.status(400).json({ message: 'Valid phase required.' })
        }

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
