import produce from 'immer'
import type { MouseEvent } from 'react'
import { useState } from 'react'
import { getTeamName } from '../lib/game'
import { CommandType, PlayerView } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import { styleColor } from '../lib/util/dom-style'
import { postCommand } from '../lib/util/fetch-json'
import useGame from '../lib/util/use-game'
import ActionModalOptions from './control/action-modal-options'
import IconSvg from './control/icon-svg'
import PlayerOptionButton from './player-option-button'

type Props = typeof defaultProps & {
  player?: PlayerView | null
  onClose?: () => void
}

const defaultProps = {}

const PlayerCard = ({ player, onClose }: Props) => {
  const [fetching, setFetching] = useState(false)
  const { game, mutate } = useGame()
  if (!game || !player) return null

  const teamName = getTeamName(player.team)
  const opposingTeamName = getTeamName(player.team === 1 ? 2 : 1)

  const handleCommand = (cmd: CommandType) => async (e: MouseEvent) => {
    e.preventDefault()
    if (fetching || player.fetching) return

    setFetching(true)
    try {
      await postCommand(game.type, game.room, cmd, player)
      mutate(
        produce((game) => {
          if (game) {
            const i = game.players.findIndex((p) => p.id === player.id)
            if (i >= 0) {
              game.players[i].fetching = true
            }
          }
        }, game)
      )
    } catch (err) {
      console.error(`Error posting command '${cmd}'.`, err.data ?? err)
    }
    setFetching(false)
    onClose?.()
  }

  const opt = (type: CommandType, text: string) => (
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
        {player.canChangeTeam &&
          opt('change_player_team', `Move to ${opposingTeamName} team`)}

        {player.canSetNextPsychic &&
          opt('set_next_psychic', 'Make next psychic')}

        {player.canSetPsychic &&
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
