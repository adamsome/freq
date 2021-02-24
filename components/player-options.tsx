import React from 'react'
import { DEBUG_MODE_KEY } from '../lib/consts'
import { CommandType, Player } from '../types/game.types'
import { User } from '../types/user.types'
import { isBrowser } from '../util/dom'
import { styleColor } from '../util/dom-style'
import { postCommand } from '../util/fetch-json'

type Props = typeof defaultProps & {
  user: User
  room?: string
  player?: Player | null
  isDarkMode?: boolean
  onDarkModeToggle?: () => void
  onDebugToggle?: () => void
  onEditPlayer?: () => void
  onLogout?: () => void
  onClose?: () => void
}

const defaultProps = {}

const PlayerOptions = ({
  user,
  room,
  player,
  isDarkMode,
  onDarkModeToggle,
  onDebugToggle,
  onEditPlayer,
  onLogout,
  onClose,
}: Props) => {
  const debugModeVal: any = isBrowser && localStorage[DEBUG_MODE_KEY]
  const allowDebugMode = debugModeVal === true || debugModeVal === 'true'

  const handleCommand = (cmd: CommandType) => async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!player || !room) return

    try {
      await postCommand(room, cmd, player)
    } catch (err) {
      console.error(`Error posting command '${cmd}'.`, err.data ?? err)
    }
    if (onClose) onClose()
  }

  return (
    <>
      <h2 style={styleColor(player, 1)}>{user.name ?? 'Noname'}</h2>
      <div>
        {allowDebugMode && (
          <button style={styleColor(player)} onClick={onDebugToggle}>
            Debug mode
          </button>
        )}

        <button style={styleColor(player)} onClick={onDarkModeToggle}>
          {!isDarkMode ? 'Dark' : 'Light'} mode
        </button>

        {player && (
          <button style={styleColor(player)} onClick={onEditPlayer}>
            Change name and icon
          </button>
        )}

        {player?.leader && (
          <button
            style={styleColor(player)}
            onClick={handleCommand('toggle_player_leader')}
          >
            Remove as leader
          </button>
        )}

        {player?.leader && (
          <button
            style={styleColor(player)}
            onClick={handleCommand('prep_new_match')}
          >
            Start a new match
          </button>
        )}

        <button className="leave" onClick={onLogout}>
          {player ? 'Leave' : 'Logout'}
        </button>

        <button className="close" onClick={onClose}>
          Close
        </button>
      </div>

      <style jsx>{`
        h2 {
          color: var(--body-light);
          background: var(--translucent);
          margin: 0;
          padding: 0.2em calc(var(--inset-md) + 28px) 0.2em var(--inset-md);
        }

        div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0;
          min-width: 16em;
        }

        div > * {
          flex: 0;
          width: 100%;
        }

        button {
          text-align: left;
          padding: var(--stack-sm) var(--inset-md);
          color: var(--body);
          border-radius: 0;
        }

        button:not(:last-child),
        button:focus:not(:last-child) {
          border: 0;
          border-bottom: 1px solid var(--border-1);
        }

        button:hover {
          background: var(--bg-2);
        }

        button.close {
          background: var(--bg-2);
          border: 0;
          color: var(--subtle);
        }

        button.close:hover {
          color: var(--body);
        }

        .leave {
          color: brown;
        }
      `}</style>
    </>
  )
}

PlayerOptions.defaultProps = defaultProps

export default PlayerOptions
