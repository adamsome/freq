import {
  getSession,
  UserProfile,
  withApiAuthRequired,
} from '@auth0/nextjs-auth0'
import { fetchUser, fromUsers } from '../../../lib/user-store'
import { connectToDatabase } from '../../../lib/util/mongodb'

export default withApiAuthRequired(async function getUser(req, res) {
  if (req.method === 'POST') {
    try {
      const session = getSession(req, res)
      const userProfile: UserProfile | undefined = session?.user

      if (!userProfile?.sub) {
        res.status(401).end('No auth user ID found.')
        return
      }

      const user = await fetchUser(userProfile.sub)
      if (user?.type !== 'admin') {
        res.status(403).end('User must be an admin to set as-user.')
      }

      const { asUser } = await req.body

      const { db } = await connectToDatabase()
      const filter = { id: userProfile.sub }
      if (asUser) {
        await fromUsers(db).updateOne(filter, { $set: { as_user: asUser } })
      } else {
        await fromUsers(db).updateOne(filter, { $unset: { as_user: '' } })
      }

      res.json(true)
    } catch (error) {
      res.status(error.status || 500).end(error.message)
    }
  }
})
