import {
  getSession,
  UserProfile,
  withApiAuthRequired,
} from '@auth0/nextjs-auth0'
import { fetchGame } from '../../../../lib/game-store'
import { toGameView } from '../../../../lib/game-view'
import { isRoomValid } from '../../../../lib/room'
import { fetchUser } from '../../../../lib/user-store'
import { head } from '../../../../util/array'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'GET') {
    try {
      const session = getSession(req, res)
      const userProfile: UserProfile | undefined = session?.user

      if (!userProfile?.sub) {
        const message = 'No auth user ID found.'
        return res.status(401).json({ message })
      }

      const user = await fetchUser(userProfile.sub)

      if (!user) {
        const message = 'No user found.'
        return res.status(401).json({ message })
      }

      const room = head(req.query?.room)?.toLowerCase()

      if (!isRoomValid(room)) {
        const message = `Valid room required to fetch game ('${room}').`
        return res.status(500).json({ message })
      }

      if (!user.rooms[room]) {
        const message = `User (${user.email}) not in room (${room}).`
        return res.status(500).json({ message })
      }

      const game = await fetchGame(room)

      if (!game) {
        const message = 'Cannot fetch non-existant game.'
        return res.status(500).json({ message })
      }

      return res.json(toGameView(user.id, game))
    } catch (error) {
      const { response } = error
      return res
        .status(response?.status || 500)
        .json(error.data ?? { message: error.message })
    }
  }
  return res.status(404).send('')
})