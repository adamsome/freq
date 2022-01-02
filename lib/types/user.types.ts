import { Dict } from './object.types'

export interface User {
  id: string
  email: string
  name: string
  icon: string
  rooms: Dict<string>
  create_at: string
  last_login_at: string
}
