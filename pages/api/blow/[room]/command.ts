import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { fetchBlowGame } from '../../../../lib/blow/blow-game-store'
import handleBlowCommand from '../../../../lib/blow/handle-blow-command'
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

      const game = await fetchBlowGame(room)

      if (!game) {
        const message = `Cannot command non-existant game (room '${room}').`
        return res.status(500).json({ message })
      }

      await handleBlowCommand(game, user.id, type, value)

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
