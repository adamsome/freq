import {
  getSession,
  UserProfile,
  withApiAuthRequired,
} from '@auth0/nextjs-auth0'
import { joinGame } from '../../../../lib/game-store'
import { isRoomValid } from '../../../../lib/room'
import { fetchUser } from '../../../../lib/user-store'
import { head } from '../../../../util/array'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'POST') {
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
      const { team } = await req.body

      if (!isRoomValid(room)) {
        const message = `Valid room required to join ('${room}').`
        return res.status(500).json({ message })
      }

      const game = await joinGame(room, user, team)

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
