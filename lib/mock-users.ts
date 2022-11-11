import { randomIcon } from './icon'
import mockNameSet from './name'
import { Dict } from './types/object.types'
import { User } from './types/user.types'

export function createMockUser(index: number, rooms: Dict<string> = {}): User {
  const name = mockNameSet[index % mockNameSet.length]
  const now = new Date().toISOString()
  return {
    id: `mock|${name.toLowerCase()}`,
    type: 'mock',
    name,
    create_at: now,
    email: `${name}@adamso.me`,
    icon: randomIcon(),
    last_login_at: now,
    rooms,
  }
}
