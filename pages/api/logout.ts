import { UserDisconnected } from '../../types/user.types'
import withSession from '../../util/with-session'

export default withSession(async (req, res) => {
  req.session.destroy()
  const user: UserDisconnected = { connected: false }
  res.json(user)
})
