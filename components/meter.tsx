import React, { CSSProperties } from 'react'
import gradientDict from '../lib/gradient'
import { Clue } from '../types/game.types'
import { PlayerGuess } from '../types/player.types'
import Needle from './needle'

type Props = typeof defaultProps & {
  clue: Clue
  player?: PlayerGuess
  otherPlayers?: PlayerGuess[]
}

const defaultProps = {}

const cssLinearGradient = (colors: string[]): CSSProperties => {
  const n = colors.length
  if (n === 0) {
    return {}
  }
  const background =
    n === 1 ? colors[0] : `linear-gradient(to right, ${colors.join(', ')})`
  return { background, backgroundPosition: 'center', backgroundSize: '120%' }
}

const cssTransform = (player: PlayerGuess): CSSProperties => ({
  left: `${player.guess * 100}%`,
})

const Meter = ({ clue, player, otherPlayers }: Props) => {
  return (
    <>
      <div className="wrapper">
        <div
          className="meter-bg"
          style={cssLinearGradient(gradientDict[clue.gradient] ?? [])}
        ></div>
        {player && (
          <div className="needle-wrapper" style={cssTransform(player)}>
            <Needle player={player} size="lg" />
          </div>
        )}
        {otherPlayers?.map((p, i) => (
          <div key={i} className="needle-wrapper" style={cssTransform(p)}>
            <Needle player={p} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .meter-bg {
          position: absolute;
          top: 0;
          right: 16px;
          bottom: var(--stack-xl);
          left: 16px;
          background: var(--bg-1);
          background-size: 125%;
          border: 1px solid var(--translucent);
          border-radius: var(--border-radius-md);
          background-position: center;
        }

        .needle-wrapper {
          position: absolute;
          top: 5px;
          left: 50%;
          height: calc(100% - 3px);
        }
      `}</style>
    </>
  )
}

Meter.defaultProps = defaultProps

export default Meter
