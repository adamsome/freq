import { BlowGameView } from '../../lib/types/blow.types'
import { CommandError } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import BlowChallengePanel from './blow-challenge-panel'
import BlowGameCommand from './blow-game-command'
import BlowRoleCardGrid from './blow-role-card-grid'

type Props = {
  className?: string
  bottomSpacerClass?: string
  game?: BlowGameView
  onError?: (error: CommandError) => void
}

export default function BlowGameBoard(props: Props) {
  const { game } = useBlowGame()
  const { className = '', bottomSpacerClass = '' } = props
  const showCommand = !game?.challenge || game.challenge?.winner != null

  return (
    <div
      className={cx(
        'flex flex-col items-center',
        'full max-w-sm space-y-2 xs:space-y-3 sm:space-y-4',
        className
      )}
    >
      <Content game={game} {...props} />

      {showCommand && (
        <div className="w-full h-12 px-6">
          <BlowGameCommand onError={props.onError} />
        </div>
      )}

      <div className={cx('flex-1 w-full', bottomSpacerClass)}></div>
    </div>
  )
}

function Content({ game }: Props) {
  if (game?.challenge) {
    return <BlowChallengePanel />
  }
  return <BlowRoleCardGrid />
}
