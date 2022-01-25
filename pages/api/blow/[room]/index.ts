import { getSession, UserProfile } from '@auth0/nextjs-auth0'
import { OptionalUnlessRequiredId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  fetchBlowGame,
  joinBlowGame,
} from '../../../../lib/blow/blow-game-store'
import { buildBlowGameView } from '../../../../lib/blow/blow-game-view'
import { isRoomValid } from '../../../../lib/room'
import { User } from '../../../../lib/types/user.types'
import { fetchUser } from '../../../../lib/user-store'
import { head } from '../../../../lib/util/array'

export default async function getBlowRoom(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'GET') {
    try {
      const room = head(req.query?.room)?.toLowerCase()

      if (!isRoomValid(room)) {
        const message = `Valid room required ('${room}')`
        return res.status(500).json({ message })
      }

      const session = getSession(req, res)
      const userProfile: UserProfile | undefined = session?.user

      let user: OptionalUnlessRequiredId<User> | null = null
      if (userProfile?.sub) {
        user = await fetchUser(userProfile.sub)
      }

      const game = await fetchBlowGame(room)
      if (game) {
        const view = buildBlowGameView(user?.id, game)
        return res.json(view)
      }

      if (user) {
        // No game exists for this room: create and join it
        const view = await joinBlowGame(room, user)
        return res.json(view)
      }

      return res.status(500).json({ message: `No game in room '${room}'.` })
    } catch (error) {
      const { response } = error
      return res
        .status(response?.status || 500)
        .json(error.data ?? { message: error.message })
    }
  }
  return res.status(404).send('')
}
