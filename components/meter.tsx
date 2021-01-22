import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import useSize from '../hooks/use-size'
import gradientDict from '../lib/gradient'
import { Clue } from '../types/game.types'
import { PlayerGuess } from '../types/player.types'
import { isLeftClick } from '../util/dom'
import Needle from './needle'

type Props = typeof defaultProps & {
  clue: Clue
  players: PlayerGuess[]
}

const defaultProps = {}

const NEEDLE_WIDTH = 32

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

const Meter = ({ clue, players }: Props) => {
  const meterRef = useRef<any>(null)
  const needleRef = useRef<any>(null)

  const [width] = useSize(meterRef)
  const [centerX, setCenterX] = useState(0)
  const [lastX, setLastX] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [dragging, setDragging] = useState(false)

  // Needle is positioned around the center of the meter
  useEffect(() => {
    // Adjust true center by half the width of the needle itself
    setCenterX(width / 2 - NEEDLE_WIDTH / 2)
  }, [width])

  // When centerX or offsetX (dragged amount) change, update the x translation
  useEffect(() => {
    if (needleRef.current) {
      const x = centerX + offsetX
      const clampedX = Math.max(0, Math.min(x, centerX * 2))
      needleRef.current.style.transform = `translateX(${clampedX}px)`
    }
  }, [centerX, offsetX])

  const onDragStart = (x?: number) => {
    setDragging(true)
    if (x) setLastX(x)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return
    // Set x offset to the last offset + the drag movement (current x - last x)
    setOffsetX(e.touches[0].pageX - lastX + offsetX)
    setLastX(e.touches[0].pageX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    // Set x offset to the last offset + the drag movement
    setOffsetX(e.movementX + offsetX)
  }

  return (
    <>
      <div
        ref={meterRef}
        className="wrapper"
        onTouchStart={(e) => onDragStart(e.touches[0].pageX)}
        onMouseDown={(e) => isLeftClick(e) && onDragStart()}
        onTouchMove={handleTouchMove}
        onMouseMove={handleMouseMove}
        onTouchEnd={() => setDragging(false)}
        onMouseUp={() => setDragging(false)}
      >
        <div
          className="meter-bg"
          style={cssLinearGradient(gradientDict[clue.gradient] ?? [])}
        ></div>

        {players.slice(1).map((p, i) => (
          <div key={i} className="needle-wrapper" style={cssTransform(p)}>
            <Needle player={p} />
          </div>
        ))}

        <div ref={needleRef} className="needle-wrapper">
          <Needle player={players[0]} size="lg" />
        </div>
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
          bottom: var(--stack-xl);
          left: 16px;
          right: 16px;
          background: var(--bg-1);
          background-size: 125%;
          border: 1px solid var(--translucent);
          border-radius: var(--border-radius-md);
          background-position: center;
        }

        .needle-wrapper {
          position: absolute;
          top: 5px;
          height: calc(100% - 8px);
        }

        .wrapper,
        .wrapper > * {
          user-select: none;
          touch-action: none;
        }
      `}</style>
    </>
  )
}

Meter.defaultProps = defaultProps

export default Meter
