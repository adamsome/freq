import { Handler, withIronSession } from 'next-iron-session'
import { v4 as uuidv4 } from 'uuid'
import { RequestWithSession } from '../types/io.types'
import { User, UserConnected } from '../types/user.types'

/**
 * This file is a session wrapper with defaults to be used in both API
 * routes and `getServerSideProps` functions.
 */
export default function withSession(handler: Handler) {
  if (!process.env.SECRET_COOKIE_PASSWORD) {
    throw new Error('env.SECRET_COOKIE_PASSWORD not found.')
  }
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'freq/iron-session',
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === 'production' ? true : false,
    },
  })
}

export async function createUserSession(
  req: RequestWithSession,
  room: string
): Promise<UserConnected> {
  const id = uuidv4()
  const user: User = { connected: true, room, id }
  req.session.set('user', user)
  await req.session.save()
  return user
}
