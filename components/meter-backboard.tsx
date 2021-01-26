import React from 'react'
import { gradientLightTextDict } from '../lib/gradient-dict'
import { Clue } from '../types/game.types'
import { cx } from '../util/dom'
import { styleLinearGradient } from '../util/dom-style'

type Props = typeof defaultProps & {
  clue: Clue
  clueIndex: number
  isChoosing: boolean
  hasSlider: boolean
}

const defaultProps = {}

const MeterBackboard = ({ clue, clueIndex, isChoosing, hasSlider }: Props) => {
  const [lightLeft, lightRight] = gradientLightTextDict[clue.gradient] ?? []
  return (
    <div
      className={cx('meter-bg', hasSlider && 'has-slider')}
      style={styleLinearGradient(clue.gradient)}
    >
      <div className={cx({ invert: lightLeft })}>{clue.left}</div>

      <div className={cx({ invert: lightRight })}>{clue.right}</div>

      {isChoosing && (
        <div className="index">
          <div>{clueIndex + 1}</div>
        </div>
      )}

      <style jsx>{`
        .meter-bg {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--stack-xs) var(--inset-sm);
          background-color: var(--bg-1);
          background-size: 125%;
          background-position: center;
          color: var(--body-dark);
          font-weight: 700;
          border: 1px solid var(--translucent);
          border-radius: var(--border-radius-md);
        }

        .meter-bg.has-slider {
          bottom: var(--stack-xl);
        }

        .invert {
          color: var(--body-light);
        }

        .index {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--translucent);
          font-size: var(--font-size-xxl);
        }
      `}</style>
    </div>
  )
}

MeterBackboard.defaultProps = defaultProps

export default MeterBackboard
