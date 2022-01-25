import { getSession, UserProfile } from '@auth0/nextjs-auth0'
import { OptionalUnlessRequiredId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
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
  req: NextApiRequest,
  res: NextApiResponse<unknown>
): Promise<RoomUser> {
  const session = getSession(req, res)
  const userProfile: UserProfile | undefined = session?.user

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
