import type { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '../../../../lib/auth0'
import { OptionalId, WithId } from 'mongodb'
import getRoomUser from '../../../../lib/get-room-user'
import { hasPlayer } from '../../../../lib/player'
import handleResCommand from '../../../../lib/res/handle-res-command'
import { fetchResGame } from '../../../../lib/res/res-game-store'
import { ResGame } from '../../../../lib/types/res.types'

export default auth0.withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const roomUser = await getRoomUser(req)

        if (roomUser.status === 'error') {
          return res.status(401).json({ message: roomUser.error })
        }

        const { room, user } = roomUser
        const { type, value, asUser } = await req.body

        if (!user.rooms[room]) {
          const message = `User (${user.email}) not in room (${room}).`
          return res.status(500).json({ message })
        }

        const rawGame = await fetchResGame(room)

        if (!rawGame) {
          const message = `Cannot command non-existant game (room '${room}').`
          return res.status(500).json({ message })
        }

        const game = { ...rawGame } as ResGame
        delete (game as OptionalId<WithId<ResGame>>)._id

        let userID = user.id
        if (user.type === 'admin') {
          userID = asUser ?? user.as_user ?? userID
        }
        // user.rooms is keyed by room name only and isn't cleared on kick, so
        // check the game itself.
        if (!hasPlayer(game.players, userID)) {
          const message = `Not a player in room (${room}).`
          return res.status(403).json({ message })
        }

        await handleResCommand(game, userID, type, value)

        return res.json(true)
      } catch (error) {
        const { response } = error
        return res
          .status(response?.status || 500)
          .json(error.data ?? { message: error.message })
      }
    }
    return res.status(404).send('')
  }
)
