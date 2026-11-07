import type { NextApiRequest, NextApiResponse } from 'next'
import type { User as AuthUser } from '@auth0/nextjs-auth0/types'
import { auth0 } from '../../../lib/auth0'
import { fetchUser } from '../../../lib/user-store'

export default auth0.withApiAuthRequired(async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await auth0.getSession(req)
    const userProfile: AuthUser | undefined = session?.user

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
