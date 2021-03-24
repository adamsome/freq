import { useState } from 'react'
import { mutate } from 'swr'
import useFreqGame from '../hooks/use-freq-game'
import { getTeamColor } from '../lib/color-dict'
import {
  API_FREQ_GAME,
  API_FREQ_JOIN,
  API_USER,
  API_USER_ROOMS,
} from '../lib/consts'
import { getPreferredTeam } from '../lib/player'
import { FreqCommand, FreqGameView } from '../types/freq.types'
import { postJson } from '../util/fetch-json'
import CommandButton from './command-button'

type Props = typeof defaultProps & {
  room: string
}

const defaultProps = {}

export default function GameJoinButtons({ room }: Props) {
  const { game } = useFreqGame()
  if (!game) return null

  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)

  const handleJoinClick = (team: number) => async (e: React.MouseEvent) => {
    e.preventDefault()
    if (cmd.disabled || fetching) return
    setFetching(true)

    if (error) {
      setError(null)
      setFetching(false)
      return
    }

    try {
      const path = API_FREQ_JOIN.replace('%0', room)
      const game: FreqGameView = await postJson(path, { team })
      mutate(API_USER)
      mutate(API_FREQ_GAME.replace('%0', room), game)
      mutate(API_USER_ROOMS)
      setFetching(false)
    } catch (err) {
      console.error(`Error posting command '${cmd.type}'.`, err.data ?? err)
      setError(String(err?.data?.message ?? err?.message))
      setFetching(false)
    }
  }

  const preferredTeam = getPreferredTeam(game.players)
  const cmd: FreqCommand = {
    text: `Join Red`,
    color: getTeamColor(1),
    rightText: `Join Blue`,
    rightWidth: preferredTeam === 1 ? 1 / 8 : 7 / 8,
    rightColor: getTeamColor(2),
    fetching,
  }

  return (
    <div className="w-full px-4 mb-6">
      <div className="mb-2 last:mb-0">
        <CommandButton
          command={cmd}
          currentPlayer={game.currentPlayer}
          fetching={fetching}
          onClick={(_, i = 0) => handleJoinClick(i + 1)}
        />
      </div>

      {error && <div className="text-red-700 text-center mt-2">{error}</div>}
    </div>
  )
}

GameJoinButtons.defaultProps = defaultProps
