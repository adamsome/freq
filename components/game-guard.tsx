import React from 'react'
import useGame from '../hooks/use-game'
import useKickUser from '../hooks/use-kick-user'
import TitleMessage from './title-message'

type Props = typeof defaultProps & {
  children: React.ReactNode
}

const defaultProps = {}

export default function GameGuard({ children }: Props) {
  useKickUser()
  const { loading, error } = useGame()

  if (loading) {
    return <TitleMessage subtle>Loading room...</TitleMessage>
  }

  if (error) {
    const msg = error
      ? error?.data?.message ?? error?.message ?? String(error)
      : ''
    console.error('Game state error:', msg)
    return <TitleMessage error>🤷‍♀️ Sorry... ({msg})</TitleMessage>
  }

  return <>{children}</>
}

GameGuard.defaultProps = defaultProps
