import {
  getSession,
  UserProfile,
  withApiAuthRequired,
} from '@auth0/nextjs-auth0'
import { findManyBlowGames } from '../../../lib/blow/blow-game-store'
import { buildBlowGameView } from '../../../lib/blow/blow-game-view'
import { findManyCwdGames } from '../../../lib/cwd/cwd-game-store'
import { toCwdGameView } from '../../../lib/cwd/cwd-game-view'
import { findManyFreqGames } from '../../../lib/freq/freq-game-store'
import { toFreqGameView } from '../../../lib/freq/freq-game-view'
import { mostRecentGamesComparer } from '../../../lib/game'
import { findManyResGames } from '../../../lib/res/res-game-store'
import { buildResGameView } from '../../../lib/res/res-game-view'
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

    const roomIDs = Object.keys(user.rooms)

    const freqGames = await findManyFreqGames(roomIDs, { limit: 5 })
    const cwdGames = await findManyCwdGames(roomIDs, { limit: 5 })
    const blowGames = await findManyBlowGames(roomIDs, { limit: 5 })
    const resGames = await findManyResGames(roomIDs, { limit: 5 })

    const freqViews = freqGames.map((g) => toFreqGameView(user.id, g))
    const cwdViews = cwdGames.map((g) => toCwdGameView(user.id, g))
    const blowViews = blowGames.map((g) => buildBlowGameView(user.id, g))
    const resViews = resGames.map((g) => buildResGameView(g, user.id))

    const views: BaseGame[] = [
      ...freqViews,
      ...cwdViews,
      ...blowViews,
      ...resViews,
    ]

    const mruViews = views.sort(mostRecentGamesComparer)

    res.json(mruViews)
  } catch (error) {
    res.status(error.status || 500).end(error.message)
  }
})
