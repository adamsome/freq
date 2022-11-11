import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import getRoomUser from '../../../../lib/get-room-user'
import {
  joinResGame,
  joinResGameAsGuests,
} from '../../../../lib/res/res-game-store'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'POST') {
    try {
      const roomUser = await getRoomUser(req, res)

      if (roomUser.status === 'error') {
        return res.status(401).json({ message: roomUser.error })
      }

      if (roomUser.user.type === 'admin') {
        const { users } = await req.body
        if (users) {
          console.log(`Joining ${users.length} mock guests`)
          const game = await joinResGameAsGuests(roomUser.room, users)
          return res.json(game)
        }
      }

      const game = await joinResGame(roomUser.room, roomUser.user)

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
