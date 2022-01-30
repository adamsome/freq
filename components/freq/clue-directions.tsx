import { PlayerWithGuess } from '../../lib/types/game.types'
import { partition } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'

type Props = typeof defaultProps & {
  directions: PlayerWithGuess[]
  hasSlider: boolean
}

const defaultProps = {}

const ClueDirections = ({ directions, hasSlider }: Props) => {
  const [leftDirections, rest] = partition((d) => d.value === -1, directions)
  const rightDirections = rest.filter((d) => d.value === 1)

  const column = (directions: PlayerWithGuess[]) => (
    <div className="flex-center h-full w-7 flex-col text-center text-xl">
      {directions.slice(0, 4).map((d, i) => (
        <div key={d.id + i}>{d.icon}</div>
      ))}
    </div>
  )

  return (
    <div
      className={cx(`
        flex-center absolute top-0 w-full
        ${hasSlider ? 'bottom-8' : 'bottom-0'}
      `)}
    >
      {column(leftDirections)}
      <div className="flex-auto"></div>
      {column(rightDirections)}
    </div>
  )
}

ClueDirections.defaultProps = defaultProps

export default ClueDirections
