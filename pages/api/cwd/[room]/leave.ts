import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { leaveCwdGame } from '../../../../lib/cwd/cwd-game-store'
import getRoomUser from '../../../../lib/get-room-user'
import { removeUserRoom } from '../../../../lib/user-store'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'POST') {
    try {
      const roomUser = await getRoomUser(req, res)

      if (roomUser.status === 'error') {
        return res.status(401).json({ message: roomUser.error })
      }

      const { room, user } = roomUser

      await leaveCwdGame(room, user.id, { deleteEmpty: true })
      await removeUserRoom(user.id, room)

      return res.json(user)
    } catch (error) {
      const { response } = error
      return res
        .status(response?.status || 500)
        .json(error.data ?? { message: error.message })
    }
  }
  return res.status(404).send('')
})
