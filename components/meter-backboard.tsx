import React, { CSSProperties } from 'react'
import gradientDict, { gradientLightTextDict } from '../lib/gradient-dict'
import { Clue } from '../types/game.types'
import { cx } from '../util/dom'

type Props = typeof defaultProps & {
  clue: Clue
}

const defaultProps = {}

const styleLinearGradient = (gradient: string): CSSProperties => {
  const colors = gradientDict[gradient]
  const n = colors?.length
  if (!n || n === 0) {
    return { color: `var(--body)` }
  }
  const background =
    n === 1 ? colors[0] : `linear-gradient(to right, ${colors.join(', ')})`
  return { background, backgroundPosition: 'center', backgroundSize: '120%' }
}

const MeterBackboard = ({ clue }: Props) => {
  return (
    <div className="meter-bg" style={styleLinearGradient(clue.gradient)}>
      <div
        className={cx({ invert: gradientLightTextDict[clue.gradient]?.[0] })}
      >
        {clue.left}
      </div>
      <div
        className={cx({ invert: gradientLightTextDict[clue.gradient]?.[1] })}
      >
        {clue.right}
      </div>

      <style jsx>{`
        .meter-bg {
          position: absolute;
          top: 0;
          bottom: var(--stack-xl);
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--stack-xs) var(--inset-sm);
          background: var(--bg-1);
          background-size: 125%;
          color: var(--body-dark);
          font-weight: 700;
          border: 1px solid var(--translucent);
          border-radius: var(--border-radius-md);
          background-position: center;
        }

        .invert {
          color: var(--body-light);
        }
      `}</style>
    </div>
  )
}

MeterBackboard.defaultProps = defaultProps

export default MeterBackboard
