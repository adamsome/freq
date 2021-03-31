import React from 'react'
import useGame from '../hooks/use-game'
import { isRoomValid } from '../lib/room'
import { GameType } from '../types/game.types'
import TitleMessage from './title-message'

type Props = typeof defaultProps & {
  children: React.ReactNode
  type?: GameType
  room?: string
}

const defaultProps = {}

export default function GameGuard({ children, type, room }: Props) {
  const { error } = useGame()

  if (error) {
    const msg = error
      ? error?.data?.message ?? error?.message ?? String(error)
      : ''

    return (
      <TitleMessage type={type} error>
        🤷‍♀️ Sorry... ({msg})
      </TitleMessage>
    )
  }

  if (room && !isRoomValid(room)) {
    return (
      <TitleMessage type={type} error>
        Room ({room}) is invalid.
      </TitleMessage>
    )
  }

  return <>{children}</>
}

GameGuard.defaultProps = defaultProps
