import { CommandError } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import BlowBoardCommandArea from './blow-board-command-area'
import BlowBoardContent from './blow-board-content'

type Props = {
  className?: string
  bottomSpacerClass?: string
  onCommandError?: (error: CommandError) => void
}

export default function BlowBoardLayout(props: Props) {
  const { className = '', bottomSpacerClass = '', onCommandError } = props

  return (
    <div
      className={cx(
        'flex flex-col items-center',
        'full max-w-sm space-y-2 xs:space-y-3 sm:space-y-4',
        className
      )}
    >
      <BlowBoardContent />

      <BlowBoardCommandArea onCommandError={onCommandError} />

      <div className={cx('flex-1 w-full', bottomSpacerClass)}></div>
    </div>
  )
}
