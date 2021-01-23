import { UserConnected, UserDisconnected } from '../../types/user.types'
import withSession from '../../util/with-session'

export default withSession(async (req, res) => {
  const user: UserConnected | null = req.session.get('user')

  if (user?.connected) {
    res.json({ ...user })
  } else {
    const disconnectedUser: UserDisconnected = { connected: false }
    res.json(disconnectedUser)
  }
})
