import { CommandError } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import IconSvg from '../control/icon-svg'
import BlowBoardCommand from './blow-board-command'
import BlowLabel from './blow-label'

type Props = {
  className?: string
  onCommandError?: (error: CommandError) => void
}

export default function BlowBoardCommandArea(props: Props) {
  const { className, onCommandError } = props
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
    return (
      <div
        className={cx(
          'max-w-xs h-12 px-6 text-center',
          'font-narrow text-lg',
          'text-gray-400 dark:text-gray-500',
          className
        )}
      >
        {!game.pickTarget.fetching ? (
          <BlowLabel label={game.pickTarget.description} />
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
    <div className={cx('w-full h-12 px-6', className)}>
      <BlowBoardCommand onCommandError={onCommandError} />
    </div>
  )
}
