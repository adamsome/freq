import {
  getSession,
  UserProfile,
  withApiAuthRequired,
} from '@auth0/nextjs-auth0'
import { findManyCwdGames } from '../../../lib/cwd/cwd-game-store'
import { toCwdGameView } from '../../../lib/cwd/cwd-game-view'
import { findManyFreqGames } from '../../../lib/freq/freq-game-store'
import { toFreqGameView } from '../../../lib/freq/freq-game-view'
import { fetchUser } from '../../../lib/user-store'
import { CwdGameView } from '../../../lib/types/cwd.types'
import { FreqGameView } from '../../../lib/types/freq.types'

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

    const freqGames = await findManyFreqGames(Object.keys(user.rooms))
    const cwdGames = await findManyCwdGames(Object.keys(user.rooms))

    const freqViews = freqGames.map((g) => toFreqGameView(user.id, g))
    const cwdViews = cwdGames.map((g) => toCwdGameView(user.id, g))

    const views: (FreqGameView | CwdGameView)[] = [...freqViews, ...cwdViews]
    const mruViews = views.sort((a, b) => {
      const aa = a.round_started_at ?? a?.match_started_at ?? a?.room_started_at
      const bb = b.round_started_at ?? b?.match_started_at ?? b?.room_started_at

      return aa < bb ? 1 : aa > bb ? -1 : 0
    })

    res.json(mruViews)
  } catch (error) {
    res.status(error.status || 500).end(error.message)
  }
})
