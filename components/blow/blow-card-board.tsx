import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import CommandPanel from '../command-panel'
import { ButtonProps } from '../control/button'
import GameJoinButtons from '../game-join-buttons'
import SkeletonBox from '../layout/skeleton-box'
import BlowRoleCard from './blow-role-card'

type Props = typeof defaultProps

const defaultProps = {}

const BUTTON_DEFAULTS: ButtonProps = {
  className: 'font-spaced-narrow',
  color: 'cyan',
  variant: 'dim',
  border: true,
  round: false,
}

export default function BlowCardBoard(_: Props) {
  const { game } = useBlowGame()

  return (
    <div className="flex-center flex-col space-y-4">
      <div
        className={cx(
          'grid gap-4 grid-cols-2 grid-rows-3',
          '[--blow-card-unit:1.4375rem]'
        )}
      >
        {range(0, 6).map((i) => (
          <BlowRoleCard
            key={i}
            role={game?.roles?.[i]}
            actions={game?.actionState}
          />
        ))}
      </div>

      {!game ? (
        <SkeletonBox className="w-full h-14 mb-6 md:px-4" />
      ) : !game.currentPlayer ? (
        <GameJoinButtons room={game.room} button={BUTTON_DEFAULTS} />
      ) : (
        <CommandPanel
          button={{
            ...BUTTON_DEFAULTS,
            color: game.commands[0]?.disabled ? 'gray' : 'cyan',
            variant: 'dim',
          }}
        />
      )}
    </div>
  )
}

BlowCardBoard.defaultProps = defaultProps
