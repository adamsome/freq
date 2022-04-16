import produce from 'immer'
import { useState } from 'react'
import { Command, CommandError } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import { postCommand } from '../lib/util/fetch-json'
import { isObject } from '../lib/util/object'
import { isNotNil } from '../lib/util/string'
import useGame from '../lib/util/use-game'
import CommandButton from './command-button'
import { ButtonProps } from './control/button'

type Props = {
  className?: string
  commands?: Command[]
  button?: Partial<ButtonProps>
  spacingClassName?: string
  fullHeight?: boolean
  hideError?: boolean
  onCommandError?: (error: CommandError) => void
}

interface HasPayload {
  payload: Record<string, unknown>
}

function hasPayload(value: unknown): value is HasPayload {
  return isObject(value) && isNotNil(value.payload)
}

export default function CommandPanel({
  className = 'w-full px-4 mb-6',
  commands: overrideCommands,
  button = {},
  spacingClassName,
  fullHeight,
  hideError,
  onCommandError,
}: Props) {
  const { game, mutate } = useGame()

  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)

  if (!game) return null

  const { currentPlayer, commands: gameCommands } = game
  const commands = overrideCommands ?? gameCommands

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
    if (timerExpired == null) {
      if (isRight) {
        if (cmd.rightDisabled == null) {
          if (cmd.disabled) return
        } else if (cmd.rightDisabled === true) return
      } else if (cmd.disabled) return
    }

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
      onCommandError?.({ command: cmd, data, message, date: new Date() })
    }

    setFetching(false)
  }

  return (
    <div className={className}>
      {commands.map((cmd, rowIndex) => (
        <div
          className={cx('mb-2 last:mb-0', { 'h-full': fullHeight })}
          key={cmd.type + cmd.text + cmd.info + cmd.rightText}
        >
          <CommandButton
            command={cmd}
            currentPlayer={currentPlayer}
            fetching={fetching}
            button={button}
            rightButton={button}
            spacingClassName={spacingClassName}
            fullHeight={fullHeight}
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
        <div className="mt-2 text-center text-red-700">{error}</div>
      )}
    </div>
  )
}
