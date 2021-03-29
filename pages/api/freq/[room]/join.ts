import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { joinFreqGame } from '../../../../lib/freq/freq-game-store'
import getRoomUser from '../../../../lib/get-room-user'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'POST') {
    try {
      const roomUser = await getRoomUser(req, res)

      if (roomUser.status === 'error') {
        return res.status(401).json({ message: roomUser.error })
      }

      const { room, user } = roomUser
      const { team } = await req.body

      const game = await joinFreqGame(room, user, team)

      return res.json(game)
    } catch (error) {
      const { response } = error
      return res
        .status(response?.status || 500)
        .json(error.data ?? { message: error.message })
    }
  }
  return res.status(404).send('')
})
