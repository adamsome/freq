import { Dict } from './object.types'

export interface User {
  id: string
  type?: 'mock' | 'guest' | 'admin'
  email: string
  name: string
  icon: string
  rooms: Dict<string>
  create_at: string
  last_login_at: string
  as_user?: string
}
