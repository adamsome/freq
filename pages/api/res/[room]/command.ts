import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { OptionalId, WithId } from 'mongodb'
import getRoomUser from '../../../../lib/get-room-user'
import handleResCommand from '../../../../lib/res/handle-res-command'
import { fetchResGame } from '../../../../lib/res/res-game-store'
import { ResGame } from '../../../../lib/types/res.types'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'POST') {
    try {
      const roomUser = await getRoomUser(req, res)

      if (roomUser.status === 'error') {
        return res.status(401).json({ message: roomUser.error })
      }

      const { room, user } = roomUser
      const { type, value, asUser } = await req.body

      if (!user.rooms[room]) {
        const message = `User (${user.email}) not in room (${room}).`
        return res.status(500).json({ message })
      }

      const rawGame = await fetchResGame(room)

      if (!rawGame) {
        const message = `Cannot command non-existant game (room '${room}').`
        return res.status(500).json({ message })
      }

      const game = { ...rawGame } as ResGame
      delete (game as OptionalId<WithId<ResGame>>)._id

      let userID = user.id
      if (user.type === 'admin') {
        userID = asUser ?? user.as_user ?? userID
      }
      await handleResCommand(game, userID, type, value)

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
