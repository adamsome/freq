import produce from 'immer'
import React, { useState } from 'react'
import useFreqGame from '../hooks/use-freq-game'
import {
  getNextPsychic,
  isInvalidPlayerTeamChange,
} from '../lib/freq/freq-game'
import { getTeamName } from '../lib/game'
import { FreqCommandType, FreqGameView } from '../types/freq.types'
import { Player } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import { postCommand } from '../util/fetch-json'
import ActionModalOptions from './action-modal-options'
import IconSvg from './icon-svg'
import PlayerOptionButton from './player-option-button'

type Props = typeof defaultProps & {
  player?: Player | null
  onClose?: () => void
}

const defaultProps = {}

const PlayerCard = ({ player, onClose }: Props) => {
  const [fetching, setFetching] = useState(false)
  const { game, mutate } = useFreqGame()
  if (!game || !player) return null

  const { phase, psychic, canChangePsychicTo, team_turn } = game

  const teamName = getTeamName(player.team)
  const opposingTeamName = getTeamName(player.team === 1 ? 2 : 1)
  const nextPsychic = getNextPsychic(game)

  const canChangeNextPsychic =
    canChangePsychicTo === 'none'
      ? false
      : canChangePsychicTo === 'any'
      ? true
      : !nextPsychic || player.team === nextPsychic.team

  const canChangePsychic = phase === 'choose' && player.team === team_turn
  const canChangeTeam = !isInvalidPlayerTeamChange(game, player)

  const handleCommand = (type: FreqCommandType) => async (
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    if (fetching || player.fetching) return

    setFetching(true)
    try {
      await postCommand(game.room, type, player)
      mutate(
        produce((game?: FreqGameView) => {
          if (game) {
            const i = game.players.findIndex((p) => p.id === player.id)
            if (i >= 0) {
              game.players[i].fetching = true
            }
          }
        })
      )
    } catch (err) {
      console.error(`Error posting command '${type}'.`, err.data ?? err)
    }
    setFetching(false)
    onClose?.()
  }

  const opt = (type: FreqCommandType, text: string) => (
    <PlayerOptionButton
      disabled={fetching || player.fetching}
      onClick={handleCommand(type)}
    >
      {text}
    </PlayerOptionButton>
  )

  return (
    <>
      <h2
        className={cx(
          'bg-gray-400 dark:bg-gray-700',
          'text-3xl text-white font-semibold',
          'm-0 px-4 py-2'
        )}
        style={styleColor(player, 1)}
      >
        {player.name}
      </h2>

      <ActionModalOptions>
        {canChangeTeam &&
          opt('change_player_team', `Move to ${opposingTeamName} team`)}

        {psychic !== player.id &&
          nextPsychic?.id !== player.id &&
          canChangeNextPsychic &&
          opt('set_next_psychic', 'Make next psychic')}

        {psychic !== player.id &&
          nextPsychic?.id !== player.id &&
          canChangePsychic &&
          opt('set_current_psychic', 'Change to current psychic')}

        {!player.leader &&
          opt('toggle_player_leader', `Make ${teamName} leader`)}

        {opt('kick_player', 'Kick player')}

        <PlayerOptionButton
          close
          disabled={fetching || player?.fetching}
          className="inline-flex items-center"
          onClick={onClose}
        >
          {fetching || player?.fetching ? 'Processing' : 'Close'}
          {(fetching || player?.fetching) && (
            <IconSvg name="spinner" className="w-5 h-5 ml-3 text-white" />
          )}
        </PlayerOptionButton>
      </ActionModalOptions>
    </>
  )
}

PlayerCard.defaultProps = defaultProps

export default PlayerCard
