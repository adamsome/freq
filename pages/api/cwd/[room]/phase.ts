import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { updateCwdGamePath } from '../../../../lib/cwd/cwd-game-store'
import getRoomUser from '../../../../lib/get-room-user'

export default withApiAuthRequired(async (req, res) => {
  if (req.method === 'POST') {
    try {
      const roomUser = await getRoomUser(req, res)

      if (roomUser.status === 'error') {
        return res.status(401).json({ message: roomUser.error })
      }

      const phase = req.body?.phase

      if (!phase) {
        return res.status(500).end('Phase required.')
      }

      // TODO: Validate phase value
      await updateCwdGamePath(roomUser.room, 'phase', phase)
      return res.json(true)
    } catch (error) {
      const { response } = error
      return res.status(response?.status || 500).json(error.data)
    }
  }
  return res.status(404).send('')
})
