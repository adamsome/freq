import { leaveGame } from '../../lib/game-store'
import { User } from '../../types/user.types'
import withSession from '../../util/with-session'

export default withSession(async (req, res) => {
  let user: User | undefined = req.session.get('user')
  if (user?.connected) {
    await leaveGame(user.room, user.id)
  }

  req.session.destroy()
  user = { connected: false }
  res.json(user)
})
