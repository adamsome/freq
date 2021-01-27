import React from 'react'
import { reverse, tail } from '../util/array'

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

const MeterTarget = ({ position, width }: Props) => {
  const bands = TARGET_BANDS.concat(tail(reverse(TARGET_BANDS)))

  return (
    <div
      className="target"
      style={{ left: `${position - width / 2}%`, width: `${width}%` }}
    >
      {bands.map(([n, opacity], i) => (
        <div key={`${n}_${i}`} style={{ opacity }}>
          <div>{n}</div>
        </div>
      ))}

      <style jsx>{`
        .target {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          width: 15%;
          height: 100%;
          overflow: hidden;
        }

        .target > * {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-content: center;
          flex: 1;
          height: 100%;
          background: var(--body);
        }

        .target > * > * {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-content: center;
          flex: 1;
          text-align: center;
          color: var(--translucent-inverse-1);
          font-size: min(4vw, 1em);
        }

        .target > * > *:last-child {
          justify-content: flex-end;
        }
      `}</style>
    </div>
  )
}

MeterTarget.defaultProps = defaultProps

export default MeterTarget
