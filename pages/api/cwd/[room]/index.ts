import { getSession, UserProfile } from '@auth0/nextjs-auth0'
import { WithId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { fetchCwdGame, joinCwdGame } from '../../../../lib/cwd/cwd-game-store'
import { toCwdGameView } from '../../../../lib/cwd/cwd-game-view'
import { isRoomValid } from '../../../../lib/room'
import { User } from '../../../../lib/types/user.types'
import { fetchUser } from '../../../../lib/user-store'
import { head } from '../../../../lib/util/array'

export default async function getCwdRoom(
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

      let user: WithId<User> | null = null
      if (userProfile?.sub) {
        user = await fetchUser(userProfile.sub)
      }

      const game = await fetchCwdGame(room)
      if (game) {
        return res.json(toCwdGameView(user?.id, game))
      }

      if (user) {
        // No game exists for this room: create and join it
        const view = await joinCwdGame(room, user)
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
