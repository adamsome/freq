import { Command, CommandError } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import CommandPanel from '../command-panel'
import { ButtonColor, ButtonProps } from '../control/button'
import GameJoinButtons from '../game-join-buttons'
import SkeletonBox from '../layout/skeleton-box'

type Props = {
  className?: string
  position: 'bottom' | 'grid-item' | 'action-bottom'
  command?: Command
  onCommandError?: (error: CommandError) => void
}

export default function BlowBoardCommand(props: Props) {
  const { className: _className, position, command, onCommandError } = props
  const { game } = useBlowGame()
  const { currentPlayer, commands: gameCommands } = game ?? {}
  const commands = command ? [command] : gameCommands
  const cmd = commands?.[0]

  if (!game)
    return (
      <SkeletonBox
        className={cx('w-full', {
          'mb-6 h-8 md:px-4': position === 'action-bottom',
          'mb-6 h-12 md:px-4': position === 'bottom',
          'h-[4.85rem]': position === 'grid-item',
        })}
        innerClassName={position === 'grid-item' ? 'rounded-md' : undefined}
        roundedClassName={position === 'grid-item' ? 'rounded-md' : undefined}
      />
    )

  const className =
    position === 'grid-item' ? (_className ?? '') + ' full' : _className
  const buttonProps: ButtonProps = {
    className:
      position === 'grid-item'
        ? 'font-narrow text-lg'
        : position === 'bottom'
        ? 'font-spaced-narrow'
        : 'font-spaced-narrow text-base',
    color: (cmd?.color as ButtonColor) ?? (cmd?.disabled ? 'gray' : 'cyan'),
    variant: 'dim',
    border: true,
    round: position === 'grid-item',
  }

  if (!currentPlayer)
    return (
      <GameJoinButtons
        room={game.room}
        className={className}
        button={buttonProps}
        fullHeight
      />
    )

  return (
    <CommandPanel
      hideError
      className={className}
      commands={commands}
      button={buttonProps}
      spacingClassName="m-0 px-0.5 py-0.5 xs:px-1 xs:py-1 sm:px-2 sm:px-2"
      fullHeight
      onCommandError={onCommandError}
    />
  )
}
