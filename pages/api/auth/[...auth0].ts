import { handleAuth, handleCallback } from '@auth0/nextjs-auth0'
import { handleAfterUserLogin } from '../../../lib/user-store'

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, {
        afterCallback: handleAfterUserLogin,
      })
    } catch (error) {
      res.status(error.status || 500).end(error.message)
    }
  },
})
