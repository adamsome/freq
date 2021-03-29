import React from 'react'
import useGame from '../hooks/use-game'
import { GameType } from '../types/game.types'
import TitleMessage from './title-message'

type Props = typeof defaultProps & {
  children: React.ReactNode
  type?: GameType
}

const defaultProps = {}

export default function GameGuard({ children, type }: Props) {
  const { loading, error } = useGame()

  if (loading) {
    return (
      <TitleMessage type={type} subtle>
        Loading room...
      </TitleMessage>
    )
  }

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

  return <>{children}</>
}

GameGuard.defaultProps = defaultProps
