import React, { useRef, useState } from 'react'
import useLayoutEffect from '../hooks/use-passive-layout-effect'
import iconSet from '../lib/icon'
import { CommandType, Player } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import { postCommand } from '../util/fetch-json'

type Props = typeof defaultProps & {
  player: Player
  onClose?: () => void
}

const defaultProps = {}

const PlayerEdit = ({ player, onClose }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => {
    inputRef.current?.select()
  }, [inputRef.current])

  const [icon, setIcon] = useState(player.icon ?? '')
  const [name, setName] = useState(player.name ?? '')

  const handleCommand = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (name.length < 3) return
    const cmd: CommandType = 'edit_player'
    try {
      await postCommand(cmd, { ...player, name, icon })
    } catch (err) {
      console.error(`Error posting command '${cmd}'.`, err.data ?? err)
    }
    if (onClose) onClose()
  }

  return (
    <>
      <h2 style={styleColor(player, true)}>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.currentTarget.value.substr(0, 15))}
        />
        <div className="icon">{icon}</div>
      </h2>
      <div className="body">
        <div className="grid">
          {iconSet.map((i) => (
            <div
              key={i}
              className={cx({ lit: i === icon })}
              onClick={() => setIcon(i)}
            >
              {i}
            </div>
          ))}
        </div>
        <button className="save" onClick={handleCommand}>
          Save
        </button>
      </div>

      <style jsx>{`
        h2 {
          position: relative;
          color: var(--body-light);
          background: var(--translucent);
          margin: 0;
          padding: 0;
        }

        input {
          background: transparent;
          height: 100%;
          max-width: 100%;
          width: 100%;
          margin: 0;
          padding-left: 3rem;
          font-weight: 600;
          border-color: transparent;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .icon {
          position: absolute;
          top: 0;
          left: 0.7rem;
          font-size: var(--font-size-xl);
        }

        .body {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0;
          min-width: 16em;
          height: 400px;
          overflow: hidden;
        }

        .body > * {
          flex: 0 0 auto;
          width: 100%;
        }

        .grid {
          width: 100%;
          height: calc(100% - 2.3rem);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          background: var(--bg-2);
          padding-top: var(--stack-sm);
          font-size: var(--font-size-xl);
          overflow: auto;
        }

        .grid > * {
          padding: 0 0.4rem;
          height: 2.65rem;
          border: 1px solid transparent;
          border-radius: var(--border-radius-md);
          cursor: pointer;
        }

        .grid > *.lit {
          background: var(--bg);
        }

        .grid > *:hover {
          background: var(--bg);
          border: 1px solid var(--primary);
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

        button.save {
          background: var(--primary);
          border: 0;
          color: var(--body-light);
          border-bottom-left-radius: var(--border-radius-sm);
          border-bottom-right-radius: var(--border-radius-sm);
        }

        button.save:hover {
          background: var(--primary-lit);
        }

        button.close:hover {
          color: var(--body);
        }
      `}</style>
    </>
  )
}

PlayerEdit.defaultProps = defaultProps

export default PlayerEdit
