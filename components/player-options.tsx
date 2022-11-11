import produce from 'immer'
import type { MouseEvent } from 'react'
import { useState } from 'react'
import { CommandType } from '../lib/types/game.types'
import { User } from '../lib/types/user.types'
import { cx } from '../lib/util/dom'
import { styleColor } from '../lib/util/dom-style'
import { postCommand } from '../lib/util/fetch-json'
import useGame from '../lib/util/use-game'
import ActionModalOptions from './control/action-modal-options'
import IconSvg from './control/icon-svg'
import PlayerOptionButton from './player-option-button'

type Props = typeof defaultProps & {
  user: User
  theme?: string
  onThemeToggle?: () => void
  onDebugToggle?: () => void
  onEditPlayer?: () => void
  onOpenRoomSettings?: () => void
  onLogout?: () => void
  onLeave?: (room: string) => void
  onClose?: () => void
}

const defaultProps = {}

const Opt = PlayerOptionButton

const PlayerOptions = ({
  user,
  theme,
  onThemeToggle,
  onDebugToggle,
  onEditPlayer,
  onOpenRoomSettings,
  onLogout,
  onLeave,
  onClose,
}: Props) => {
  const [fetching, setFetching] = useState(false)
  const { game, mutate } = useGame()
  const player = game?.currentPlayer

  const allowDebugMode = user.type === 'admin'

  const colorMode = `${theme === 'dark' ? 'Light' : 'Dark'} Mode`
  const leaveLabel = `${game ? 'Leave' : 'Log out'}`
  const handleLeave = game
    ? () => onLeave && onLeave(game.room)
    : () => onLogout && onLogout()

  const handleCommand = (cmd: CommandType) => async (e: MouseEvent) => {
    e.preventDefault()
    if (!game || !player || fetching || player.fetching) return

    setFetching(true)
    try {
      await postCommand(game.type, game.room, cmd, player)
      mutate(
        produce((game) => {
          if (game && game.currentPlayer) {
            game.currentPlayer.fetching = true
          }
        }, game)
      )
    } catch (err) {
      console.error(`Error posting command '${cmd}'.`, err.data ?? err)
    }
    setFetching(false)
    onClose?.()
  }

  return (
    <>
      <h2
        className={cx(`
          m-0
          bg-gray-400
          px-4 py-2
          text-3xl font-semibold text-white
          dark:bg-gray-700
        `)}
        style={styleColor(player, 1)}
      >
        {user.name ?? 'Noname'}
      </h2>

      <ActionModalOptions>
        {allowDebugMode && <Opt onClick={onDebugToggle}>Debug Mode</Opt>}

        <Opt onClick={onThemeToggle}>{colorMode}</Opt>

        {player && <Opt onClick={onEditPlayer}>Change Name & Icon</Opt>}

        {(player?.leader || player?.designatedPsychic) && (
          <Opt onClick={handleCommand('prep_new_match')}>Start a New Match</Opt>
        )}

        {game?.phase === 'prep' && (
          <Opt onClick={onOpenRoomSettings}>Room Settings</Opt>
        )}

        <Opt leave onClick={handleLeave}>
          {leaveLabel}
        </Opt>

        <Opt
          close
          disabled={fetching || player?.fetching}
          className="inline-flex items-center"
          onClick={onClose}
        >
          {fetching || player?.fetching ? 'Processing' : 'Close'}
          {(fetching || player?.fetching) && (
            <IconSvg name="spinner" className="ml-3 h-5 w-5 text-white" />
          )}
        </Opt>
      </ActionModalOptions>
    </>
  )
}

PlayerOptions.defaultProps = defaultProps

export default PlayerOptions
