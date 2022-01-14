import produce from 'immer'
import { useState } from 'react'
import { Command, CommandError } from '../lib/types/game.types'
import { postCommand } from '../lib/util/fetch-json'
import { isObject } from '../lib/util/object'
import { isNotNil } from '../lib/util/string'
import useGame from '../lib/util/use-game'
import CommandButton from './command-button'
import { ButtonProps } from './control/button'

type Props = {
  button?: Partial<ButtonProps>
  spacingClassName?: string
  hideError?: boolean
  onError?: (error: CommandError) => void
}

interface HasPayload {
  payload: Record<string, unknown>
}

function hasPayload(value: unknown): value is HasPayload {
  return isObject(value) && isNotNil(value.payload)
}

export default function CommandPanel({
  button = {},
  spacingClassName,
  hideError,
  onError,
}: Props) {
  const { game, mutate } = useGame()

  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)

  if (!game) return null

  const { currentPlayer, commands } = game

  if (!currentPlayer) return null

  const handleCommandClick = async (
    event: React.MouseEvent | null,
    cmd: Command,
    rowIndex: number,
    colIndex = 0,
    timerExpired?: boolean
  ) => {
    event?.preventDefault()

    if (fetching) return

    const isRight = colIndex > 0
    if (isRight) {
      if (cmd.rightDisabled == null) {
        if (cmd.disabled) return
      } else if (cmd.rightDisabled === true) return
    } else if (cmd.disabled) return

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

    const cmdType = isRight ? cmd.rightType ?? cmd.type : cmd.type
    let value = isRight ? cmd.rightValue : cmd.value

    // If the timer expired, add a 1s delay to give other players a change
    // to submit given network delay
    const delay = timerExpired ? 1 : 0
    // If the timer expired, indicated in cmd payload, if it has one
    if (timerExpired && hasPayload(value)) {
      value = { ...value, payload: { ...value.payload, expired: true } }
    }

    try {
      await postCommand(game.type, game.room, cmdType, value, delay)
      mutate(
        produce((game) => {
          if (game) game.commands[rowIndex].fetching = true
        }, game)
      )
    } catch (err) {
      const data = err?.data ?? err
      const message = String(data?.message ?? err?.message ?? '')
      console.error(`Error posting command '${cmd.type}'.`, data)
      setError(message)
      onError?.({ command: cmd, data, message, date: new Date() })
    }

    setFetching(false)
  }

  return (
    <div className="w-full px-4 mb-6">
      {commands.map((cmd, rowIndex) => (
        <div
          className="mb-2 last:mb-0"
          key={cmd.type + cmd.text + cmd.info + cmd.rightText}
        >
          <CommandButton
            command={cmd}
            currentPlayer={currentPlayer}
            fetching={fetching}
            button={button}
            rightButton={button}
            spacingClassName={spacingClassName}
            onClick={(event, cmd, colIndex) =>
              handleCommandClick(event, cmd, rowIndex, colIndex)
            }
            onTimerFinish={(colIndex) =>
              handleCommandClick(null, cmd, rowIndex, colIndex, true)
            }
          />
        </div>
      ))}

      {error && !hideError && (
        <div className="text-red-700 text-center mt-2">{error}</div>
      )}
    </div>
  )
}
