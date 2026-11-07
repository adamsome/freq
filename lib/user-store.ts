import type { SessionData } from '@auth0/nextjs-auth0/types'
import { Db, MatchKeysAndValues, OptionalUnlessRequiredId } from 'mongodb'
import { randomIcon } from './icon'
import { randomName } from './name'
import { User } from './types/user.types'
import { connectToDatabase } from './util/mongodb'

export const fromUsers = (db: Db) =>
  db.collection<OptionalUnlessRequiredId<User>>('users')

export async function fetchUser(
  id?: string
): Promise<OptionalUnlessRequiredId<User> | null> {
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

/** Creates the user record on first login; records last_login_at. */
export async function handleAfterUserLogin(
  session: SessionData
): Promise<void> {
  const userProfile = session.user
  if (!userProfile?.email || !userProfile.sub) return

  const id = userProfile.sub
  const email = userProfile.email

  const { db } = await connectToDatabase()
  const users = fromUsers(db)

  const user = await users.findOne({ id })

  const last_login_at = new Date().toISOString()

  if (user) {
    const changes: Partial<User> = { last_login_at }
    await users.updateOne({ id }, { $set: changes })
    return
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
}
