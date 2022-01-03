import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { mutate } from 'swr'
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
import { getPreferredTeam } from '../lib/player'
import { Command, TeamGuessGameView } from '../lib/types/game.types'
import { postJson } from '../lib/util/fetch-json'
import useGame from '../lib/util/use-game'
import CommandButton from './command-button'

type Props = typeof defaultProps & {
  room: string
}

const defaultProps = {}

export default function GameJoinButtons({ room }: Props) {
  const router = useRouter()
  const { user } = useUser()
  const { game } = useGame()

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

  const preferredTeam = getPreferredTeam(game.players)
  const command: Command = user
    ? {
        text: `Join Red`,
        color: getTeamColor(1),
        rightText: `Join Blue`,
        rightWidth: preferredTeam === 1 ? 1 / 8 : 7 / 8,
        rightColor: getTeamColor(2),
        fetching,
      }
    : {
        text: 'Log In to Join',
        color: 'International Klein Blue',
        fetching,
      }

  return (
    <div className="w-full px-4 mb-6">
      <div className="mb-2 last:mb-0">
        <CommandButton
          command={command}
          currentPlayer={game.currentPlayer}
          fetching={fetching}
          onClick={handleJoinClick}
        />
      </div>

      {error && <div className="text-red-700 text-center mt-2">{error}</div>}
    </div>
  )
}

GameJoinButtons.defaultProps = defaultProps
