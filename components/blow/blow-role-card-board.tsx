import { CommandError } from '../../lib/types/game.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import CommandPanel from '../command-panel'
import { ButtonProps } from '../control/button'
import GameJoinButtons from '../game-join-buttons'
import SkeletonBox from '../layout/skeleton-box'
import BlowCard from './blow-card'

type Props = {
  className?: string
  bottomSpacerClass?: string
  onError?: (error: CommandError) => void
}

const BUTTON_DEFAULTS: ButtonProps = {
  className: 'font-spaced-narrow',
  color: 'cyan',
  variant: 'dim',
  border: true,
  round: false,
}

export default function BlowRoleCardBoard({
  className = '',
  bottomSpacerClass = '',
  onError,
}: Props) {
  const { game } = useBlowGame()
  const { roles, currentPlayer, commands, actionState } = game ?? {}

  return (
    <div
      className={cx(
        'flex flex-col items-center',
        'full max-w-sm space-y-2 xs:space-y-3 sm:space-y-4',
        className
      )}
    >
      <div
        className={cx(
          'grid gap-2 gap xs:gap-3 sm:gap-4 grid-cols-2',
          'grid-rows-[repeat(3,minmax(0,auto))] xs:grid-rows-3'
        )}
      >
        {range(0, 6).map((i) => {
          const role = roles?.[i]
          const cards = currentPlayer?.cards ?? []
          const currentCards = role ? cards.filter((r) => r === role).length : 0
          return (
            <BlowCard
              key={i}
              id={role}
              size="md"
              orientation="horizontal"
              variant="faceup"
              actions={actionState}
              currentCards={currentCards}
            />
          )
        })}
      </div>

      <div className="w-full h-12 px-6">
        {!game ? (
          <SkeletonBox className="w-full h-12 mb-6 md:px-4" />
        ) : !currentPlayer ? (
          <GameJoinButtons room={game.room} button={BUTTON_DEFAULTS} />
        ) : (
          <CommandPanel
            hideError
            button={{
              ...BUTTON_DEFAULTS,
              color: commands?.[0]?.disabled ? 'gray' : 'cyan',
              variant: 'dim',
            }}
            spacingClassName="m-0 px-0.5 py-0.5 xs:px-1 xs:py-1 sm:px-2 sm:px-2"
            onError={onError}
          />
        )}
      </div>

      <div className={cx('flex-1 w-full', bottomSpacerClass)}></div>
    </div>
  )
}
