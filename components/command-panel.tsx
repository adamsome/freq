import { useState } from 'react'
import useGame from '../hooks/use-game'
import { Command } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import { postCommand } from '../util/fetch-json'

const CommandPanel = () => {
  const [game] = useGame()
  if (!game) return null

  const [error, setError] = useState<string | null>(null)

  const { currentPlayer, commands } = game

  const getCmdRightWidth = (cmd: Command) => {
    const w = (cmd.rightWidth ?? 0.5) * 100
    const min = '6.25em'
    const rawWidth = `calc(${w}% - calc(var(--inset-sm) / 2))`
    return `max(${min}, min(${rawWidth}, calc(100% - ${min})))`
  }

  const handleCommandClick = (cmd: Command, i = 0) => async (
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    if (cmd.disabled) return
    if (error) setError(null)
    if (!cmd.type) return
    const value = i > 0 ? cmd.rightValue : cmd.value
    try {
      await postCommand(cmd.type, value)
    } catch (err) {
      console.error(`Error posting command '${cmd.type}'.`, err.data ?? err)
      setError(String(err?.data?.message ?? err?.message))
    }
  }

  return (
    <div className="wrapper">
      {commands.map((cmd) => (
        <>
          <div
            key={cmd.type + cmd.text + cmd.info + cmd.rightText}
            className={cx('inline', cmd.rightText && 'multi')}
          >
            <button
              className="cmd"
              style={styleColor(!cmd.disabled && currentPlayer, true)}
              disabled={cmd.disabled}
              onClick={handleCommandClick(cmd)}
            >
              {cmd.text}
            </button>

            {cmd.rightText != null && (
              <button
                className="cmd cmd-2"
                style={{
                  ...styleColor(!cmd.disabled && currentPlayer, true),
                  flex: `0 0 ${getCmdRightWidth(cmd)}`,
                }}
                disabled={cmd.disabled}
                onClick={handleCommandClick(cmd, 1)}
              >
                {cmd.rightText}
              </button>
            )}
          </div>

          {cmd.info && (
            <div className="info" style={styleColor(cmd.infoColor)}>
              {cmd.info}
            </div>
          )}
        </>
      ))}

      {error && <div className="error">{error}</div>}

      <style jsx>{`
        .wrapper {
          width: 100%;
          padding: 0 15px;
        }

        .inline {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .inline > * {
          flex: 1;
        }

        .info {
          text-align: center;
          color: var(--subtle);
          line-height: 18px;
          margin-top: var(--stack-xs);
        }

        .cmd {
          background: var(--translucent);
          border-radius: var(--border-radius-md);
          width: 100%;
          padding-top: var(--stack-sm);
          padding-bottom: var(--stack-sm);
          border: 1px solid transparent;
          font-size: var(--font-size-lg);
        }

        .cmd:focus,
        .cmd:hover {
          border: 1px solid var(--body);
        }

        .cmd:disabled {
          background: var(--translucent);
          color: var(--hint);
        }

        .cmd:disabled:focus,
        .cmd:disabled:hover {
          border: 1px solid transparent;
        }

        .cmd-2 {
          margin-left: var(--inset-sm);
        }

        .error {
          font-size: var(--font-size-sm);
          color: brown;
          text-align: center;
          margin-top: var(--stack-sm);
        }

        @media screen and (max-width: 480px) {
          .info {
            font-size: var(--font-size-sm);
          }

          .inline.multi button {
            font-size: var(--font-size-md);
          }
        }
      `}</style>
    </div>
  )
}

export default CommandPanel
