import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import BlowCardContainer from './blow-card-container'

type Props = {
  className?: string
}

export default function BlowRoleCardGrid(props: Props) {
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
        <BlowRoleCardGridItem key={i} index={i} {...props} />
      ))}
    </div>
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
      actions={actionState}
      currentCards={currentCards}
    />
  )
}
