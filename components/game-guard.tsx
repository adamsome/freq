import type { ReactNode } from 'react'
import { isRoomValid } from '../lib/room'
import { GameType } from '../lib/types/game.types'
import { isObject } from '../lib/util/object'
import useGame from '../lib/util/use-game'
import TitleMessage from './title-message'

type Props = typeof defaultProps & {
  children: ReactNode
  type?: GameType
  room?: string
}

const defaultProps = {}

export default function GameGuard({ children, type, room }: Props) {
  const { error } = useGame()

  if (error) {
    let msg = ''
    if (isObject(error)) {
      if (isObject(error.data)) {
        msg = error.data.message as string
      }
      if (!msg) {
        msg = (error.message as string) ?? String(error)
      }
    }
    if (!msg) msg = 'Unknown Error'

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
