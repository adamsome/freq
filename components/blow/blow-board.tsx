import { CommandError } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import IconSvg from '../control/icon-svg'
import BlowBoardChallenge from './blow-board-challenge'
import BlowBoardCommand from './blow-board-command'
import BlowBoardPickLossCard from './blow-board-pick-loss-card'
import BlowBoardWinner from './blow-board-winner'
import BlowLabel from './blow-label'
import BlowRoleCardGrid from './blow-role-card-grid'

type Props = {
  className?: string
  bottomSpacerClass?: string
  onCommandError?: (error: CommandError) => void
}

export default function BlowGameBoard(props: Props) {
  const { className = '', bottomSpacerClass = '' } = props

  return (
    <div
      className={cx(
        'flex flex-col items-center',
        'full max-w-sm space-y-2 xs:space-y-3 sm:space-y-4',
        className
      )}
    >
      <Content {...props} />

      <CommandArea {...props} />

      <div className={cx('flex-1 w-full', bottomSpacerClass)}></div>
    </div>
  )
}

function Content(_: Props) {
  const { game } = useBlowGame()
  if (game?.challenge) {
    return <BlowBoardChallenge />
  }
  if (game?.winner) {
    return <BlowBoardWinner />
  }
  if (game?.pickLossCard) {
    return <BlowBoardPickLossCard />
  }
  return <BlowRoleCardGrid />
}

function CommandArea({ onCommandError }: Props) {
  const { game } = useBlowGame()
  // Hide command area during initial challenge sequence since
  // `BlowBoardChallenge` provides its own description in this area
  if (game?.challenge && game.challenge?.winner == null) return null

  if (game?.pickTarget) {
    return (
      <div
        className={cx(
          'max-w-xs h-12 px-6 text-center',
          'font-narrow text-lg',
          'text-gray-400 dark:text-gray-500'
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
    <div className="w-full h-12 px-6">
      <BlowBoardCommand onCommandError={onCommandError} />
    </div>
  )
}
