import {
  BlowActionState,
  BlowRoleActionID,
  BlowRoleID,
} from '../../lib/types/blow.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import BlowCardContainer from './blow-card-container'

type Props = {
  className?: string
}

export default function BlowRoleCardGrid(props: Props) {
  const { game } = useBlowGame()
  const { currentPlayer, roles, actionState } = game ?? {}
  const { className } = props

  return (
    <div
      className={cx(
        'grid gap-2 xs:gap-3 sm:gap-4 grid-cols-2',
        'grid-rows-[repeat(3,minmax(0,auto))] xs:grid-rows-3',
        className
      )}
    >
      {range(0, 6).map((i) => (
        <BlowRoleCardGridItem
          key={i}
          index={i}
          role={roles?.[i]}
          cards={currentPlayer?.cards}
          actionState={actionState}
        />
      ))}
    </div>
  )
}

type BlowRoleCardBoardGridItemProps = {
  role?: BlowRoleID
  cards?: (BlowRoleID | null)[]
  actionState?: Partial<Record<BlowRoleActionID, BlowActionState>>
  index: number
}

function BlowRoleCardGridItem(props: BlowRoleCardBoardGridItemProps) {
  const { index, role, cards = [], actionState } = props
  const currentCards = role ? cards.filter((r) => r === role).length : 0
  return (
    <BlowCardContainer
      id={role}
      index={index}
      size="md"
      orientation="horizontal"
      variant="faceup"
      actions={actionState}
      currentCards={currentCards}
    />
  )
}
