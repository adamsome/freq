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
  const magicRole = game?.settings.theme === 'magic'
  const showCommandAreaInGrid = magicRole
  const gridItemCount = magicRole ? 5 : 6

  return (
    <>
      {magicRole && (
        <div
          className={cx(className, {
            'grid gap-2 xs:gap-3 sm:gap-4 grid-cols-3 grid-rows-1': true,
            'w-full px-2 xs:px-3 sm:px-4': magicRole,
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
          'grid gap-2 xs:gap-3 sm:gap-4 grid-cols-2': true,
          'grid-rows-[repeat(3,minmax(0,auto))] xs:grid-rows-3': true,
          'w-full px-2 xs:px-3 sm:px-4': magicRole,
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
