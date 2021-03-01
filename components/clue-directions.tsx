import useGame from '../hooks/use-game'
import { PlayerWithGuess } from '../types/game.types'
import { partition } from '../util/array'
import { cx } from '../util/dom'

type Props = typeof defaultProps & {
  hasSlider: boolean
}

const defaultProps = {}

const ClueDirections = ({ hasSlider }: Props) => {
  const { game } = useGame()
  if (!game) return null

  const directions = game.playerDirections
  const [leftDirections, rest] = partition((d) => d.value === -1, directions)
  const rightDirections = rest.filter((d) => d.value === 1)

  const column = (directions: PlayerWithGuess[]) => (
    <div className="flex-center flex-col w-7 h-full text-center text-xl">
      {directions.slice(0, 4).map((d, i) => (
        <div key={d.id + i}>{d.icon}</div>
      ))}
    </div>
  )

  return (
    <div
      className={cx(
        'absolute top-0 flex-center w-full',
        hasSlider ? 'bottom-8' : 'bottom-0'
      )}
    >
      {column(leftDirections)}
      <div className="flex-auto"></div>
      {column(rightDirections)}
    </div>
  )
}

ClueDirections.defaultProps = defaultProps

export default ClueDirections
