import type { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '../../../../lib/auth0'
import { joinCwdGame } from '../../../../lib/cwd/cwd-game-store'
import getRoomUser from '../../../../lib/get-room-user'

export default auth0.withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const roomUser = await getRoomUser(req)

        if (roomUser.status === 'error') {
          return res.status(401).json({ message: roomUser.error })
        }

        const { room, user } = roomUser
        const { team } = await req.body

        const game = await joinCwdGame(room, user, team)

        return res.json(game)
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
