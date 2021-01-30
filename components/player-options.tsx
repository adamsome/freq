import React from 'react'
import { ColorMode } from '../types/color-mode.types'
import { CommandType, Player } from '../types/game.types'
import { isBrowser } from '../util/dom'
import { styleColor } from '../util/dom-style'
import { postCommand } from '../util/fetch-json'
import { localStorageManager } from '../util/storage-manager'

type Props = typeof defaultProps & {
  player?: Player | null
  colorMode?: ColorMode
  onDebugToggle?: () => void
  onColorModeToggle?: () => void
  onLogout?: () => void
  onClose?: () => void
}

const defaultProps = {}

const PlayerOptions = (props: Props) => {
  const { player, colorMode } = props
  const { onDebugToggle, onColorModeToggle, onLogout, onClose } = props
  if (!player) return null

  const debugModeVal: any =
    isBrowser && localStorageManager().get('freq/debug-mode')
  const allowDebugMode = debugModeVal === true || debugModeVal === 'true'

  const handleCommand = (cmd: CommandType) => async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await postCommand(cmd, player)
    } catch (err) {
      console.error(`Error posting command '${cmd}'.`, err.data ?? err)
    }
    if (onClose) onClose()
  }

  return (
    <>
      <h2 style={styleColor(player, true)}>{player.name}</h2>
      <div>
        {allowDebugMode && (
          <button style={styleColor(player)} onClick={onDebugToggle}>
            Debug mode
          </button>
        )}

        <button style={styleColor(player)} onClick={onColorModeToggle}>
          {colorMode === 'light' ? 'Dark' : 'Light'} mode
        </button>

        {player.leader && (
          <button
            style={styleColor(player)}
            onClick={handleCommand('toggle_player_leader')}
          >
            Remove as leader
          </button>
        )}

        {player.leader && (
          <button
            style={styleColor(player)}
            onClick={handleCommand('prep_new_match')}
          >
            Prepare new match
          </button>
        )}

        <button style={styleColor(player)} onClick={onLogout}>
          Exit game
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
      `}</style>
    </>
  )
}

PlayerOptions.defaultProps = defaultProps

export default PlayerOptions
