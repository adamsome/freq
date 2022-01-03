import {
  getSession,
  UserProfile,
  withApiAuthRequired,
} from '@auth0/nextjs-auth0'
import { findManyBlowGames } from '../../../lib/blow/blow-game-store'
import { toBlowGameView } from '../../../lib/blow/blow-game-view'
import { findManyCwdGames } from '../../../lib/cwd/cwd-game-store'
import { toCwdGameView } from '../../../lib/cwd/cwd-game-view'
import { findManyFreqGames } from '../../../lib/freq/freq-game-store'
import { toFreqGameView } from '../../../lib/freq/freq-game-view'
import { mostRecentGamesComparer } from '../../../lib/game'
import { BaseGame } from '../../../lib/types/game.types'
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

    const freqGames = await findManyFreqGames(Object.keys(user.rooms))
    const cwdGames = await findManyCwdGames(Object.keys(user.rooms))
    const blowGames = await findManyBlowGames(Object.keys(user.rooms))

    const freqViews = freqGames.map((g) => toFreqGameView(user.id, g))
    const cwdViews = cwdGames.map((g) => toCwdGameView(user.id, g))
    const blowViews = blowGames.map((g) => toBlowGameView(user.id, g))

    const views: BaseGame[] = [...freqViews, ...cwdViews, ...blowViews]

    const mruViews = views.sort(mostRecentGamesComparer)

    res.json(mruViews)
  } catch (error) {
    res.status(error.status || 500).end(error.message)
  }
})
