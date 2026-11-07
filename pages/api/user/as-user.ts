import type { NextApiRequest, NextApiResponse } from 'next'
import type { User as AuthUser } from '@auth0/nextjs-auth0/types'
import { auth0 } from '../../../lib/auth0'
import { fetchUser, fromUsers } from '../../../lib/user-store'
import { connectToDatabase } from '../../../lib/util/mongodb'

export default auth0.withApiAuthRequired(async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const session = await auth0.getSession(req)
      const userProfile: AuthUser | undefined = session?.user

      if (!userProfile?.sub) {
        res.status(401).end('No auth user ID found.')
        return
      }

      const user = await fetchUser(userProfile.sub)
      if (user?.type !== 'admin') {
        res.status(403).end('User must be an admin to set as-user.')
        return
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
