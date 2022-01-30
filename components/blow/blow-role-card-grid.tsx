import { CommandError } from '../../lib/types/game.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import BlowBoardCommandArea from './blow-board-command-area'
import BlowCardContainer from './blow-card-container'

type Props = {
  className?: string
  onCommandError?: (error: CommandError) => void
}

export default function BlowRoleCardGrid(props: Props) {
  const { game } = useBlowGame()
  const { className, onCommandError } = props
  const magicRole = game?.settings.theme !== 'classic'
  const showCommandAreaInGrid = magicRole
  const gridItemCount = magicRole ? 5 : 6

  return (
    <>
      {magicRole && (
        <div
          className={cx(className, {
            'grid grid-cols-3 grid-rows-1 gap-1.5 xs:gap-2 sm:gap-4': true,
            'w-full px-1.5 xs:px-2 sm:px-4': magicRole,
          })}
        >
          {range(0, 3).map((i) => (
            <BlowCardContainer
              key={i}
              id={game?.roles.find((rid) => rid === 'common')}
              index={i}
              size="lg"
              orientation="horizontal"
              variant="faceup"
              type="role-common"
              actions={game?.actionState}
            />
          ))}
        </div>
      )}

      <div
        className={cx(className, {
          'grid grid-cols-2 grid-rows-[repeat(3,minmax(0,auto))]': true,
          'gap-1.5 xs:grid-rows-3 xs:gap-2 sm:gap-4': true,
          'w-full px-1.5 xs:px-2 sm:px-4': magicRole,
        })}
      >
        {range(0, gridItemCount).map((i) => (
          <BlowRoleCardGridItem key={i} index={i} {...props} />
        ))}

        {showCommandAreaInGrid && (
          <BlowBoardCommandArea
            position="grid-item"
            onCommandError={onCommandError}
          />
        )}
      </div>
    </>
  )
}

function BlowRoleCardGridItem(props: Props & { index: number }) {
  const { index } = props
  const { game } = useBlowGame()
  const { currentPlayer, roles, actionState } = game ?? {}

  const role = roles?.[index]
  const cards = currentPlayer?.cards ?? []
  const cardsKilled = currentPlayer?.cardsKilled

  let currentCards = 0
  if (role && cardsKilled) {
    currentCards = cards.filter((r, i) => r === role && !cardsKilled[i]).length
  }

  return (
    <BlowCardContainer
      id={role}
      index={index}
      size="lg"
      orientation="horizontal"
      variant="faceup"
      type="role"
      actions={actionState}
      currentCards={currentCards}
    />
  )
}
