import type { User as AuthUser } from '@auth0/nextjs-auth0/types'
import { auth0 } from './auth0'
import { OptionalUnlessRequiredId } from 'mongodb'
import { NextApiRequest } from 'next'
import { isRoomValid } from './room'
import { User } from './types/user.types'
import { fetchUser } from './user-store'
import { head } from './util/array'

interface RoomUserSuccess {
  status: 'ok'
  room: string
  user: OptionalUnlessRequiredId<User>
}

interface RoomUserError {
  status: 'error'
  error: string
}

type RoomUser = RoomUserSuccess | RoomUserError

export default async function getRoomUser(
  req: NextApiRequest
): Promise<RoomUser> {
  const session = await auth0.getSession(req)
  const userProfile: AuthUser | undefined = session?.user

  if (!userProfile?.sub) {
    return { status: 'error', error: 'No auth user ID found.' }
  }

  const user = await fetchUser(userProfile.sub)

  if (!user) {
    return { status: 'error', error: 'No user found.' }
  }

  const room = head(req.query?.room)?.toLowerCase()

  if (!isRoomValid(room)) {
    return { status: 'error', error: `Valid room required ('${room}').` }
  }

  return { room, user, status: 'ok' }
}
