import { AfterCallback, UserProfile } from '@auth0/nextjs-auth0'
import { Db, MatchKeysAndValues, WithId } from 'mongodb'
import { User } from '../types/user.types'
import { connectToDatabase } from '../util/mongodb'
import { randomIcon } from './icon'
import { randomName } from './name'

export const fromUsers = (db: Db) => db.collection<WithId<User>>('users')

export async function fetchUser(id?: string): Promise<WithId<User> | null> {
  const { db } = await connectToDatabase()
  if (!id) {
    return Promise.resolve(null)
  }
  return await fromUsers(db).findOne({ id })
}

export async function updateUser(
  id: string,
  changes: MatchKeysAndValues<Omit<User, 'id'>>
): Promise<void> {
  const { db } = await connectToDatabase()
  const filter = { id }
  await fromUsers(db).updateOne(filter, { $set: changes })
}

export async function addUserRoom(id: string, room: string): Promise<void> {
  const { db } = await connectToDatabase()
  const filter = { id }
  const changes = { [`rooms.${room}`]: new Date().toISOString() }
  await fromUsers(db).updateOne(filter, { $set: changes })
}

export async function removeUserRoom(id: string, room: string): Promise<void> {
  const { db } = await connectToDatabase()
  const filter = { id }
  const changes = { [`rooms.${room}`]: '' as const }
  await fromUsers(db).updateOne(filter, { $unset: changes })
}

export const handleAfterUserLogin: AfterCallback = async (
  _req,
  _res,
  session
) => {
  const userProfile = session.user as UserProfile
  if (!userProfile?.email || !userProfile.sub) return session

  const id = userProfile.sub
  const email = userProfile.email

  const { db } = await connectToDatabase()
  const users = fromUsers(db)

  const user = await users.findOne({ id })

  const last_login_at = new Date().toISOString()

  if (user) {
    const changes: Partial<User> = { last_login_at }
    users.updateOne({ id }, { $set: changes })
    return session
  }

  const newUser: User = {
    id,
    email,
    name: email.split('@')?.[0]?.substr(0, 16) || randomName(),
    icon: randomIcon(),
    rooms: {},
    create_at: last_login_at,
    last_login_at,
  }
  await users.insertOne(newUser)

  return session
}
