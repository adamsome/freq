import React from 'react'
import useGame from '../hooks/use-game'
import { DEBUG_MODE_KEY } from '../lib/consts'
import { CommandType } from '../types/game.types'
import { User } from '../types/user.types'
import { cx, isBrowser } from '../util/dom'
import { styleColor } from '../util/dom-style'
import { postCommand } from '../util/fetch-json'
import ActionModalOptions from './action-modal-options'
import PlayerOptionButton from './player-option-button'

type Props = typeof defaultProps & {
  user: User
  isDarkMode?: boolean
  onDarkModeToggle?: () => void
  onDebugToggle?: () => void
  onEditPlayer?: () => void
  onLogout?: () => void
  onLeave?: (room: string) => void
  onClose?: () => void
}

const defaultProps = {}

const Opt = PlayerOptionButton

const PlayerOptions = ({
  user,
  isDarkMode,
  onDarkModeToggle,
  onDebugToggle,
  onEditPlayer,
  onLogout,
  onLeave,
  onClose,
}: Props) => {
  const { game, mutate } = useGame()
  const player = game?.currentPlayer

  const debugModeVal: any = isBrowser && localStorage[DEBUG_MODE_KEY]
  const allowDebugMode = debugModeVal === true || debugModeVal === 'true'

  const colorMode = `${!isDarkMode ? 'Dark' : 'Light'} mode`
  const leaveLabel = `${game ? 'Leave' : 'Log out'}`
  const handleLeave = game
    ? () => onLeave && onLeave(game.room)
    : () => onLogout && onLogout()

  const handleCommand = (cmd: CommandType) => async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!game || !player) return

    try {
      await postCommand(game.room, cmd, player)
      mutate()
    } catch (err) {
      console.error(`Error posting command '${cmd}'.`, err.data ?? err)
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
        {user.name ?? 'Noname'}
      </h2>

      <ActionModalOptions>
        {allowDebugMode && <Opt onClick={onDebugToggle}>Debug mode</Opt>}

        <Opt onClick={onDarkModeToggle}>{colorMode}</Opt>

        {player && <Opt onClick={onEditPlayer}>Change name and icon</Opt>}

        {player?.leader && (
          <Opt onClick={handleCommand('toggle_player_leader')}>
            Remove as leader
          </Opt>
        )}

        {player?.leader && (
          <Opt onClick={handleCommand('prep_new_match')}>Start a new match</Opt>
        )}

        <Opt leave onClick={handleLeave}>
          {leaveLabel}
        </Opt>

        <Opt close onClick={onClose}>
          Close
        </Opt>
      </ActionModalOptions>
    </>
  )
}

PlayerOptions.defaultProps = defaultProps

export default PlayerOptions
