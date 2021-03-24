import React from 'react'
import GameGuard from '../../components/game-guard'
import GameBoard from '../../components/game-board'
import UserRoomGuard from '../../components/user-room-guard'

export default function FreqRoomPage() {
  return (
    <UserRoomGuard>
      <GameGuard>
        <GameBoard />
      </GameGuard>
    </UserRoomGuard>
  )
}
