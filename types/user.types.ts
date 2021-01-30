export interface UserConnected {
  connected: true
  id: string
  room: string
  name?: string
}

export interface UserDisconnected {
  connected: false
  name?: string
}

export type User = UserConnected | UserDisconnected
