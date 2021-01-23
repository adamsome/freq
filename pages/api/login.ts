import { v4 as uuidv4 } from 'uuid'
import { User } from '../../types/user.types'
import withSession from '../../util/with-session'

export default withSession(async (req, res) => {
  const { room } = await req.body
  const player_id = uuidv4()

  try {
    const user: User = { connected: true, room, player_id }
    req.session.set('user', user)
    await req.session.save()
    res.json(user)
  } catch (error) {
    const { response } = error
    res.status(response?.status || 500).json(error.data)
  }
})
