import { updateGameGuess } from '../../lib/game-store'
import { User } from '../../types/user.types'
import withSession from '../../util/with-session'

export default withSession(async (req, res) => {
  try {
    const user: User | null = req.session.get('user')

    if (!user || !user.connected) {
      const msg = 'Cannot fetch game with no user session.'
      return res.status(500).json(new Error(msg))
    }

    const body = await req.body
    const guess = body.guess

    await updateGameGuess(user.id, user.room, guess)
    res.json(true)
  } catch (error) {
    const { response } = error
    res.status(response?.status || 500).json(error.data)
  }
})
