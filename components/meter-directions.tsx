import { PlayerWithGuess } from '../types/game.types'
import { partition } from '../util/array'
import { cx } from '../util/dom'

type Props = typeof defaultProps & {
  directions: PlayerWithGuess[]
  hasSlider: boolean
}

const defaultProps = {}

const MeterDirections = ({ directions, hasSlider }: Props) => {
  const [leftDirections, rest] = partition((d) => d.value === -1, directions)
  const rightDirections = rest.filter((d) => d.value === 1)

  return (
    <div className={cx('wrapper', { 'has-slider': hasSlider })}>
      <div className="set">
        {leftDirections.slice(0, 4).map((d) => (
          <div key={d.id}>{d.icon}</div>
        ))}
      </div>

      <div className="spacer"></div>

      <div className="set">
        {rightDirections.slice(0, 4).map((d) => (
          <div key={d.id}>{d.icon}</div>
        ))}
      </div>

      <style jsx>{`
        .wrapper {
          position: absolute;
          top: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-content: center;
          width: 100%;
        }

        .wrapper.has-slider {
          bottom: var(--stack-xl);
        }

        .set {
          flex: 0 0 1.8rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-content: center;
          height: 100%;
          text-align: center;
          font-size: var(--font-size-lg);
        }

        .spacer {
          flex: 1 1 auto;
        }
      `}</style>
    </div>
  )
}

MeterDirections.defaultProps = defaultProps

export default MeterDirections
