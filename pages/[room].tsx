import React from 'react'
import GameGuard from '../components/game-guard'
import GameLayout from '../components/game-layout'
import UserRoomGuard from '../components/user-room-guard'

export default function RoomPage() {
  return (
    <UserRoomGuard>
      <GameGuard>
        <GameLayout />
      </GameGuard>
    </UserRoomGuard>
  )
}
