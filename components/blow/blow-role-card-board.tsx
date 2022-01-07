import { range } from '../../lib/util/array'
import { useBlowGame } from '../../lib/util/use-game'
import CommandPanel from '../command-panel'
import { ButtonProps } from '../control/button'
import GameJoinButtons from '../game-join-buttons'
import SkeletonBox from '../layout/skeleton-box'
import BlowCard from './blow-card'

type Props = typeof defaultProps

const defaultProps = {}

const BUTTON_DEFAULTS: ButtonProps = {
  className: 'font-spaced-narrow',
  color: 'cyan',
  variant: 'dim',
  border: true,
  round: false,
}

export default function BlowRoleCardBoard(_: Props) {
  const { game } = useBlowGame()
  const { roles, currentPlayer, commands, actionState } = game ?? {}

  return (
    <div className="flex-center flex-col space-y-4">
      <div className="grid gap-4 grid-cols-2 grid-rows-3">
        {range(0, 6).map((i) => {
          const role = roles?.[i]
          return (
            <BlowCard
              key={i}
              id={role}
              size="md"
              orientation="horizontal"
              variant="faceup"
              actions={actionState}
              currentCard={role && currentPlayer?.cards?.includes(role)}
            />
          )
        })}
      </div>

      {!game ? (
        <SkeletonBox className="w-full h-14 mb-6 md:px-4" />
      ) : !currentPlayer ? (
        <GameJoinButtons room={game.room} button={BUTTON_DEFAULTS} />
      ) : (
        <CommandPanel
          button={{
            ...BUTTON_DEFAULTS,
            color: commands?.[0]?.disabled ? 'gray' : 'cyan',
            variant: 'dim',
          }}
        />
      )}
    </div>
  )
}

BlowRoleCardBoard.defaultProps = defaultProps
