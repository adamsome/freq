import { CommandError } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import IconSvg from '../control/icon-svg'
import BlowBoardCommand from './blow-board-command'
import BlowLabel from './tokens/blow-label'

type Props = {
  className?: string
  position: 'bottom' | 'grid-item'
  onCommandError?: (error: CommandError) => void
}

export default function BlowBoardCommandArea(props: Props) {
  const { className, position, onCommandError } = props
  const { game } = useBlowGame()
  // Hide command area during initial challenge sequence since
  // `BlowBoardChallenge` provides its own description in this area,
  // or if a player is drawing cards (which has no command action)
  if (
    (game?.challenge && game.challenge.winner == null) ||
    (game?.drawCards && !game.drawCards.selected)
  )
    return null

  if (game?.pickTarget) {
    const { pickTarget, settings } = game
    return (
      <div
        className={cx(className, {
          'max-w-xs text-center': true,
          'h-12 px-6': position === 'bottom',
          'flex-center px-1': position === 'grid-item',
          'font-narrow text-lg': true,
          'text-gray-400 dark:text-gray-500': true,
        })}
      >
        {!pickTarget.fetching ? (
          <BlowLabel label={pickTarget.description} theme={settings.theme} />
        ) : (
          <IconSvg
            name="spinner"
            className="w-7 h-7 text-black dark:text-white"
          />
        )}
      </div>
    )
  }

  return (
    <div
      className={cx(className, {
        'pt-0 pl-0': position === 'grid-item',
        'w-full h-12 px-6': position === 'bottom',
      })}
    >
      <BlowBoardCommand position={position} onCommandError={onCommandError} />
    </div>
  )
}
