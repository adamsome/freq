import { reverse, tail } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'

const TARGET_BANDS: Array<[number, number]> = [
  [2, 0.3],
  [3, 0.4],
  [4, 0.7],
]

type Props = typeof defaultProps & {
  /** Position of target as a percent of the meter, e.g. `75` = 75%. */
  position: number
}

const defaultProps = {
  /** Width of target as a percent of the meter. */
  width: 22.5,
}

const ClueTarget = ({ position, width }: Props) => {
  const bands = TARGET_BANDS.concat(tail(reverse(TARGET_BANDS)))

  return (
    <div
      className={cx(`
        absolute top-0 left-0 flex h-full w-1/6
        animate-fade-in-slow overflow-hidden
      `)}
      style={{ left: `${position - width / 2}%`, width: `${width}%` }}
    >
      {bands.map(([n, opacity], i) => (
        <div
          key={`${n}_${i}`}
          className={cx(`
            flex h-full flex-1 flex-col content-center justify-between
            bg-black dark:bg-white
          `)}
          style={{ opacity }}
        >
          <div
            className={cx(`
              text-[length:min(4vw, 1em)]
              flex flex-1 flex-col content-center text-center
              text-white/50
              last:justify-end
              dark:text-black/50
            `)}
          >
            {n}
          </div>
        </div>
      ))}
    </div>
  )
}

ClueTarget.defaultProps = defaultProps

export default ClueTarget
