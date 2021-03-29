import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { fetchFullCwdGameView } from '../../../../lib/cwd/cwd-game-store'
import handleCwdCommand from '../../../../lib/cwd/handle-cwd-command'
import getRoomUser from '../../../../lib/get-room-user'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'POST') {
    try {
      const roomUser = await getRoomUser(req, res)

      if (roomUser.status === 'error') {
        return res.status(401).json({ message: roomUser.error })
      }

      const { room, user } = roomUser
      const { type, value } = await req.body

      if (!user.rooms[room]) {
        const message = `User (${user.email}) not in room (${room}).`
        return res.status(500).json({ message })
      }

      const game = await fetchFullCwdGameView(room, user.id)

      await handleCwdCommand(game, type, value)

      return res.json(true)
    } catch (error) {
      const { response } = error
      return res
        .status(response?.status || 500)
        .json(error.data ?? { message: error.message })
    }
  }
  return res.status(404).send('')
})
