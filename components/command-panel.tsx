import { useState } from 'react'
import useGame from '../hooks/use-game'
import { Command } from '../types/game.types'
import { postCommand } from '../util/fetch-json'
import CommandButton from './command-button'

const CommandPanel = () => {
  const [game] = useGame()
  if (!game) return null

  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)

  const { currentPlayer, commands } = game
  if (!currentPlayer) return null

  const handleCommandClick = (cmd: Command, i = 0) => async (
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    if (cmd.disabled || fetching) return
    setFetching(true)
    if (error) {
      setError(null)
      setFetching(false)
      return
    }
    if (!cmd.type) {
      setFetching(false)
      return
    }
    const value = i > 0 ? cmd.rightValue : cmd.value
    try {
      await postCommand(cmd.type, value)
      setFetching(false)
    } catch (err) {
      console.error(`Error posting command '${cmd.type}'.`, err.data ?? err)
      setError(String(err?.data?.message ?? err?.message))
      setFetching(false)
    }
  }

  return (
    <div className="wrapper">
      {commands.map((cmd) => (
        <div key={cmd.type + cmd.text + cmd.info + cmd.rightText}>
          <CommandButton
            command={cmd}
            currentPlayer={currentPlayer}
            disable={fetching}
            onClick={handleCommandClick}
          />
        </div>
      ))}

      {error && <div className="error">{error}</div>}

      <style jsx>{`
        .wrapper {
          width: 100%;
          padding: 0 15px;
        }

        .wrapper > div:not(:last-child) {
          margin-bottom: var(--stack-sm);
        }

        .error {
          font-size: var(--font-size-sm);
          color: brown;
          text-align: center;
          margin-top: var(--stack-sm);
        }
      `}</style>
    </div>
  )
}

export default CommandPanel
