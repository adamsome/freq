import {
  getSession,
  UserProfile,
  withApiAuthRequired,
} from '@auth0/nextjs-auth0'
import { fetchUser } from '../../lib/user-store'

export default withApiAuthRequired(async function getUser(req, res) {
  try {
    const session = getSession(req, res)
    const userProfile: UserProfile | undefined = session?.user

    if (!userProfile?.sub) {
      res.status(401).end('No auth user ID found.')
      return
    }

    const user = await fetchUser(userProfile.sub)

    if (!user) {
      res.status(401).end('No user found.')
      return
    }

    res.json(user)
  } catch (error) {
    res.status(error.status || 500).end(error.message)
  }
})
