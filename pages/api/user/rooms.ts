import {
  getSession,
  UserProfile,
  withApiAuthRequired,
} from '@auth0/nextjs-auth0'
import { findManyFreqGames } from '../../../lib/freq/freq-game-store'
import { toFreqGameView } from '../../../lib/freq/freq-game-view'
import { fetchUser } from '../../../lib/user-store'

export default withApiAuthRequired(async function getUser(req, res) {
  try {
    const session = getSession(req, res)
    const userProfile: UserProfile | undefined = session?.user

    if (!userProfile?.sub) {
      return res.json([])
    }

    const user = await fetchUser(userProfile.sub)

    if (!user) {
      return res.json([])
    }

    const games = await findManyFreqGames(Object.keys(user.rooms))

    const views = games.map((g) => toFreqGameView(user.id, g))

    res.json(views)
  } catch (error) {
    res.status(error.status || 500).end(error.message)
  }
})
