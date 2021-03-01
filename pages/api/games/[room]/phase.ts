import {
  getSession,
  UserProfile,
  withApiAuthRequired,
} from '@auth0/nextjs-auth0'
import { updateGamePath } from '../../../../lib/game-store'
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

      const body = await req.body
      const phase = body?.phase
      const room = head(req.query?.room)?.toLowerCase()

      if (!phase) {
        return res.status(500).end('Phase required.')
      }

      if (!isRoomValid(room)) {
        return res.status(500).end('Room invalid.')
      }

      await updateGamePath(room, 'phase', phase)
      return res.json(true)
    } catch (error) {
      const { response } = error
      return res.status(response?.status || 500).json(error.data)
    }
  }
  return res.status(404).send('')
})
