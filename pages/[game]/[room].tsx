import { useRouter } from 'next/router'
import React from 'react'
import GameBoard from '../../components/game-board'
import GameGuard from '../../components/game-guard'
import UserRoomGuard from '../../components/user-room-guard'
import { GameType } from '../../types/game.types'
import { head } from '../../util/array'

export default function FreqRoomPage() {
  const router = useRouter()
  const type = head(router.query?.game) as GameType | undefined
  return (
    <UserRoomGuard type={type}>
      <GameGuard type={type}>
        <GameBoard />
      </GameGuard>
    </UserRoomGuard>
  )
}
