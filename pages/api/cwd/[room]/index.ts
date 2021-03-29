import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { fetchCwdGame, joinCwdGame } from '../../../../lib/cwd/cwd-game-store'
import { toCwdGameView } from '../../../../lib/cwd/cwd-game-view'
import getRoomUser from '../../../../lib/get-room-user'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'GET') {
    try {
      const roomUser = await getRoomUser(req, res)

      if (roomUser.status === 'error') {
        return res.status(401).json({ message: roomUser.error })
      }

      const { room, user } = roomUser

      const game = await fetchCwdGame(room)
      if (game) {
        return res.json(toCwdGameView(user.id, game))
      }

      // No game exists for this room: create and join it
      const view = await joinCwdGame(room, user)
      return res.json(view)
    } catch (error) {
      const { response } = error
      return res
        .status(response?.status || 500)
        .json(error.data ?? { message: error.message })
    }
  }
  return res.status(404).send('')
})
