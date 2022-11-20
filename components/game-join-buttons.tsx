import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { getTeamColor } from '../lib/color-dict'
import {
  API_GAME,
  API_GAME_JOIN,
  API_LOGIN,
  API_USER,
  API_USER_ROOMS,
  KEY_ROOM,
  KEY_ROOM_REDIRECT,
  KEY_ROOM_TYPE,
} from '../lib/consts'
import { isTeamGuessGame } from '../lib/game'
import { getPreferredTeam } from '../lib/player'
import { Command, TeamGuessGameView } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import { postJson } from '../lib/util/fetch-json'
import useGame from '../lib/util/use-game'
import CommandButton from './command-button'
import { ButtonProps } from './control/button'

type Props = {
  className?: string
  room: string
  commandDefaults?: Partial<Command>
  button?: ButtonProps
  rightButton?: ButtonProps
  fullHeight?: boolean
  styleTextColor?: string
}

export default function GameJoinButtons({
  className = 'w-full px-4 mb-6',
  room,
  commandDefaults = {},
  fullHeight,
  styleTextColor,
  ...props
}: Props) {
  const router = useRouter()
  const { user } = useUser()
  const { game } = useGame()
  const { mutate } = useSWRConfig()

  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)

  if (!game) return null

  const handleJoinClick = async (
    e: React.MouseEvent,
    cmd: Command,
    team: number
  ) => {
    e.preventDefault()
    if (cmd.disabled || fetching) return
    setFetching(true)

    if (error) {
      setError(null)
      setFetching(false)
      return
    }

    if (!user) {
      localStorage[KEY_ROOM_REDIRECT] = true
      localStorage[KEY_ROOM] = room
      localStorage[KEY_ROOM_TYPE] = game.type
      await router.push(API_LOGIN)
      setError(null)
      setFetching(false)
      return
    }

    try {
      const path = API_GAME_JOIN.replace('%0', game.type).replace('%1', room)
      const newGame: TeamGuessGameView = await postJson(path, {
        team: team + 1,
      })
      mutate(API_USER)
      mutate(API_GAME.replace('%0', game.type).replace('%1', room), newGame)
      mutate(API_USER_ROOMS)
      setFetching(false)
    } catch (err) {
      console.error(`Error joining game'.`, err.data ?? err)
      setError(String(err?.data?.message ?? err?.message))
      setFetching(false)
    }
  }

  let command: Command
  if (user) {
    if (isTeamGuessGame(game.type)) {
      const preferredTeam = getPreferredTeam(game.players)
      command = {
        color: getTeamColor(1),
        rightWidth: preferredTeam === 1 ? 1 / 8 : 7 / 8,
        rightColor: getTeamColor(2),
        ...commandDefaults,
        text: `Join Red`,
        rightText: `Join Blue`,
        fetching,
      }
    } else {
      command = {
        ...commandDefaults,
        text: 'Join Game',
        fetching,
      }
    }
  } else {
    command = {
      color: 'International Klein Blue',
      ...commandDefaults,
      text: 'Log In to Join',
      fetching,
    }
  }

  return (
    <div className={className}>
      <div className={cx('mb-2 last:mb-0', { 'h-full': fullHeight })}>
        <CommandButton
          command={command}
          currentPlayer={game.currentPlayer}
          fullHeight={fullHeight}
          styleTextColor={styleTextColor}
          fetching={fetching}
          onClick={handleJoinClick}
          {...props}
        />
      </div>

      {error && <div className="mt-2 text-center text-red-700">{error}</div>}
    </div>
  )
}
