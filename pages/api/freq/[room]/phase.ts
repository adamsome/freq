import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { updateFreqGamePath } from '../../../../lib/freq/freq-game-store'
import getRoomUser from '../../../../lib/get-room-user'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'POST') {
    try {
      const roomUser = await getRoomUser(req, res)

      if (roomUser.status === 'error') {
        return res.status(401).json({ message: roomUser.error })
      }

      const { room } = roomUser
      const phase = req.body?.phase

      if (!phase) {
        res.status(500).end('Phase required.')
        return
      }

      await updateFreqGamePath(room, 'phase', phase)
      return res.json(true)
    } catch (error) {
      const { response } = error
      return res.status(response?.status || 500).json(error.data)
    }
  }
  return res.status(404).send('')
})
