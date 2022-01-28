import { BlowThemeID } from '../../lib/types/blow.types'
import { CommandError } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import BlowBoardCommandArea from './blow-board-command-area'
import BlowBoardContent from './blow-board-content'

type Props = {
  className?: string
  theme?: BlowThemeID
  bottomSpacerClass?: string
  onCommandError?: (error: CommandError) => void
}

export default function BlowBoardLayout(props: Props) {
  const { className, theme, bottomSpacerClass = '', onCommandError } = props
  const { game } = useBlowGame()

  const showBottomCommandArea =
    theme !== 'magic' ||
    (game?.challenge && game.challenge.winner != null) ||
    (game?.drawCards && game.drawCards.selected) ||
    game?.pickLossCard ||
    game?.winner

  return (
    <div
      className={cx(
        'flex flex-col items-center',
        'full max-w-sm space-y-2 xs:space-y-3 sm:space-y-4',
        className
      )}
    >
      <BlowBoardContent onCommandError={onCommandError} />

      {showBottomCommandArea && (
        <BlowBoardCommandArea
          position="bottom"
          onCommandError={onCommandError}
        />
      )}

      <div className={cx('flex-1 w-full', bottomSpacerClass)}></div>
    </div>
  )
}
