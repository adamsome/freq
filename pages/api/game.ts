import { isRoomValid } from '../../lib/game'
import { fetchGame } from '../../lib/game-store'
import { toGameView } from '../../lib/game-view'
import { User } from '../../types/user.types'
import withSession from '../../util/with-session'

export default withSession(async (req, res) => {
  const user: User | null = req.session.get('user')

  if (!user || !user.connected) {
    const msg = 'Cannot fetch game with no user session.'
    return res.status(500).json(new Error(msg))
  }

  const room = user.room

  if (!isRoomValid(room)) {
    const msg = 'Cannot fetch game with invalid room.'
    return res.status(500).json(new Error(msg))
  }

  const game = await fetchGame(room)

  if (!game) {
    const msg = 'Cannot fetch non-existant game.'
    return res.status(500).json(new Error(msg))
  }

  res.json(toGameView(user.id, game))
})
