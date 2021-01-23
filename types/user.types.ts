export interface UserConnected {
  connected: true
  room: string
  id: string
}

export interface UserDisconnected {
  connected: false
}

export type User = UserConnected | UserDisconnected
