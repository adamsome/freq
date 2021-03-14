import {
  getSession,
  UserProfile,
  withApiAuthRequired,
} from '@auth0/nextjs-auth0'
import commandGame from '../../../../lib/game-command'
import { fetchCurrentGameView } from '../../../../lib/game-store'
import { isRoomValid } from '../../../../lib/room'
import { fetchUser } from '../../../../lib/user-store'
import { head } from '../../../../util/array'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'POST') {
    try {
      const session = getSession(req, res)
      const userProfile: UserProfile | undefined = session?.user

      if (!userProfile?.sub) {
        return res.status(401).end('No auth user ID found.')
      }

      const user = await fetchUser(userProfile.sub)

      if (!user) {
        return res.status(401).end('No user found.')
      }

      const { type, value } = await req.body
      const room = head(req.query?.room)?.toLowerCase()

      if (!isRoomValid(room)) {
        const message = `Valid room (${room}) required to do command ('${type}').`
        return res.status(500).json({ message })
      }

      if (!user.rooms[room]) {
        const message = `User (${user.email}) not in room (${room}).`
        return res.status(500).json({ message })
      }

      const game = await fetchCurrentGameView(room, user.id)

      await commandGame(game, type, value)

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
