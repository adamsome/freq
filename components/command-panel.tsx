import produce from 'immer'
import { useState } from 'react'
import useGame from '../hooks/use-game'
import { Command, GameView } from '../types/game.types'
import { postCommand } from '../util/fetch-json'
import CommandButton from './command-button'

const CommandPanel = () => {
  const { game, mutate } = useGame()
  if (!game) return null

  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)

  const { currentPlayer, commands } = game
  if (!currentPlayer) return null

  const handleCommandClick = (i: number) => (cmd: Command, j = 0) => async (
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
    const value = j > 0 ? cmd.rightValue : cmd.value
    try {
      await postCommand(game.room, cmd.type, value)
      mutate(
        produce((game: GameView | undefined) => {
          if (game) game.commands[i].fetching = true
        })
      )
    } catch (err) {
      console.error(`Error posting command '${cmd.type}'.`, err.data ?? err)
      setError(String(err?.data?.message ?? err?.message))
    }
    setFetching(false)
  }

  return (
    <div className="w-full px-4 mb-6">
      {commands.map((cmd, i) => (
        <div
          className="mb-2 last:mb-0"
          key={cmd.type + cmd.text + cmd.info + cmd.rightText}
        >
          <CommandButton
            command={cmd}
            currentPlayer={currentPlayer}
            fetching={fetching}
            onClick={handleCommandClick(i)}
          />
        </div>
      ))}

      {error && <div className="text-red-700 text-center mt-2">{error}</div>}
    </div>
  )
}

export default CommandPanel
