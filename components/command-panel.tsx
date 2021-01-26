import useGame from '../hooks/use-game'
import { Command } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import { postCommand } from '../util/fetch-json'

const CommandPanel = () => {
  const [game] = useGame()
  if (!game) return null

  const { currentPlayer, commands, commandInfo } = game

  const handleCommandClick = (cmd: Command) => async (e: React.MouseEvent) => {
    e.preventDefault()
    if (cmd.waiting || !cmd.type) return
    postCommand(cmd.type)
  }

  return (
    <div className="wrapper">
      {commands.map((a, i) => (
        <button
          key={i}
          className={cx('cmd', (a.waiting || a.disabled) && 'waiting')}
          style={styleColor(!a.waiting && !a.disabled && currentPlayer, true)}
          disabled={a.waiting || a.disabled}
          onClick={handleCommandClick(a)}
        >
          {a.text}
        </button>
      ))}
      <div className="info">{commandInfo}</div>

      <style jsx>{`
        .wrapper {
          width: 100%;
          padding: 0 15px;
        }

        .info {
          text-align: center;
          color: var(--subtle);
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

        .cmd.waiting {
          background: var(--translucent);
          color: var(--hint);
        }

        .cmd.waiting:focus,
        .cmd.waiting:hover {
          border: 1px solid transparent;
        }

        @media screen and (max-width: 480px) {
          .info {
            font-size: var(--font-size-sm);
          }
        }
      `}</style>
    </div>
  )
}

export default CommandPanel
