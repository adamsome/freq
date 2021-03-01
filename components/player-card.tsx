import React from 'react'
import useGame from '../hooks/use-game'
import {
  getNextPsychic,
  getTeamName,
  isInvalidPlayerTeamChange,
} from '../lib/game'
import { CommandType, Player } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import { postCommand } from '../util/fetch-json'
import ActionModalOptions from './action-modal-options'
import PlayerOptionButton from './player-option-button'

type Props = typeof defaultProps & {
  player?: Player | null
  onClose?: () => void
}

const defaultProps = {}

const Opt = PlayerOptionButton

const PlayerCard = ({ player, onClose }: Props) => {
  const { game, mutate } = useGame()
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

  const handleCommand = (type: CommandType) => async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await postCommand(game.room, type, player)
      mutate()
    } catch (err) {
      console.error(`Error posting command '${type}'.`, err.data ?? err)
    }
    if (onClose) onClose()
  }

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
        {canChangeTeam && (
          <Opt onClick={handleCommand('change_player_team')}>
            Move to {opposingTeamName} team
          </Opt>
        )}

        {psychic !== player.id &&
          nextPsychic?.id !== player.id &&
          canChangeNextPsychic && (
            <Opt onClick={handleCommand('set_next_psychic')}>
              Make next psychic
            </Opt>
          )}

        {psychic !== player.id &&
          nextPsychic?.id !== player.id &&
          canChangePsychic && (
            <Opt onClick={handleCommand('set_current_psychic')}>
              Change to current psychic
            </Opt>
          )}

        {!player.leader && (
          <Opt onClick={handleCommand('toggle_player_leader')}>
            Make {teamName} leader
          </Opt>
        )}

        <Opt onClick={handleCommand('kick_player')}>Kick player</Opt>

        <Opt close onClick={onClose}>
          Close
        </Opt>
      </ActionModalOptions>
    </>
  )
}

PlayerCard.defaultProps = defaultProps

export default PlayerCard
