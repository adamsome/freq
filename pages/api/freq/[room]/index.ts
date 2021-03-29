import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import {
  fetchFreqGame,
  joinFreqGame,
} from '../../../../lib/freq/freq-game-store'
import { toFreqGameView } from '../../../../lib/freq/freq-game-view'
import getRoomUser from '../../../../lib/get-room-user'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'GET') {
    try {
      const roomUser = await getRoomUser(req, res)

      if (roomUser.status === 'error') {
        return res.status(401).json({ message: roomUser.error })
      }

      const { room, user } = roomUser

      let game = await fetchFreqGame(room)

      if (!game) {
        game = await joinFreqGame(room, user)
      }

      return res.json(toFreqGameView(user.id, game))
    } catch (error) {
      const { response } = error
      return res
        .status(response?.status || 500)
        .json(error.data ?? { message: error.message })
    }
  }
  return res.status(404).send('')
})
