import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import useSize from '../hooks/use-size'
import { useThrottle } from '../hooks/use-throttle'
import gradientDict from '../lib/gradient-dict'
import { Clue } from '../types/game.types'
import { PlayerGuess } from '../types/player.types'
import { isLeftClick } from '../util/dom'
import Needle from './needle'

type Props = typeof defaultProps & {
  clue: Clue
  players: PlayerGuess[]
  onGuessChange: (guess: number) => void
}

const defaultProps = {}

const NEEDLE_WIDTH = 32
const NEEDLE_TEAMMATE_WIDTH = 24
const CHANGE_FPS = 2

const styleLinearGradient = (colors: string[]): CSSProperties => {
  const n = colors.length
  if (n === 0) {
    return {}
  }
  const background =
    n === 1 ? colors[0] : `linear-gradient(to right, ${colors.join(', ')})`
  return { background, backgroundPosition: 'center', backgroundSize: '120%' }
}

const Meter = ({ clue, players, onGuessChange }: Props) => {
  const meterWrapperRef = useRef<any>(null)
  const needleRef = useRef<any>(null)

  const [meterWrapperWidth] = useSize(meterWrapperRef)
  const meterWidth = meterWrapperWidth - NEEDLE_WIDTH

  // How far the needle has been dragged from center position
  const [needleOffsetX, setNeedleOffsetX] = useState(0)

  const needleCenterX = meterWidth / 2
  const actualNeedleX = needleCenterX + needleOffsetX
  // Clamp needle X position to the bounds of the meter
  const needleX = Math.max(0, Math.min(actualNeedleX, needleCenterX * 2))
  // Update needle transform when its x position changes
  useEffect(() => {
    if (needleRef.current)
      needleRef.current.style.transform = `translateX(${needleX}px)`
  }, [needleX])

  const needleGuessPercent = needleX / meterWidth

  // Throttle the guess change callback
  const throttledGuessState = useThrottle<number | null>(null, CHANGE_FPS)
  const [throttledGuess, setThrottledGuess] = throttledGuessState

  useEffect(() => {
    if (throttledGuess != null) onGuessChange(throttledGuess)
  }, [throttledGuess])

  // Handle mouse drag events

  const [needleDragStartAt, setNeedleDragStartAt] = useState<Date | null>(null)
  const [needleDragStartX, setNeedleDragStartX] = useState(0)

  const handleNeedleDragStart = (mouseX?: number) => {
    setNeedleDragStartAt(new Date())
    if (mouseX) setNeedleDragStartX(mouseX)
  }

  const handleNeedleDragMove = (mouseX: number) => {
    if (!needleDragStartAt) return
    // Set x offset to the last offset + the drag movement (current x - last x)
    setNeedleOffsetX(mouseX - needleDragStartX + needleOffsetX)
    setNeedleDragStartX(mouseX)
    // Only set our output guess (which triggers callback event) after delay
    const msSinceDragStart = new Date().getTime() - needleDragStartAt.getTime()
    if (msSinceDragStart > 1000 * (1 / CHANGE_FPS)) {
      setThrottledGuess(needleGuessPercent)
    }
  }

  const handleNeedleDragEnd = () => {
    setNeedleDragStartAt(null)
    // Reset offset if the actual x is out of bounds of the meter
    const actualX = needleCenterX + needleOffsetX
    if (actualX < 0) {
      setNeedleOffsetX(-needleCenterX)
    } else if (actualX > needleCenterX * 2) {
      setNeedleOffsetX(needleCenterX)
    }
    setThrottledGuess(needleGuessPercent)
  }

  const buildTeammateNeedleTranslate = (guess: number) => {
    const needleTeammateWidthDiff = NEEDLE_WIDTH - NEEDLE_TEAMMATE_WIDTH
    const x = meterWidth * guess + needleTeammateWidthDiff / 2
    return `translateX(${x}px)`
  }

  return (
    <>
      <div
        ref={meterWrapperRef}
        className="wrapper"
        onTouchStart={(e) => handleNeedleDragStart(e.touches[0].pageX)}
        onMouseDown={(e) => isLeftClick(e) && handleNeedleDragStart(e.pageX)}
        onTouchMove={(e) => handleNeedleDragMove(e.touches[0].pageX)}
        onMouseMove={(e) => handleNeedleDragMove(e.pageX)}
        onTouchEnd={handleNeedleDragEnd}
        onMouseUp={handleNeedleDragEnd}
      >
        <div
          className="meter-bg"
          style={styleLinearGradient(gradientDict[clue.gradient] ?? [])}
        >
          <div>{clue.left}</div>
          <div>{clue.right}</div>
        </div>

        {/* Teammate Needles */}
        {players.slice(1).map((p, i) => (
          <div
            key={i}
            className="needle-wrapper needle-teammate"
            style={{ transform: buildTeammateNeedleTranslate(p.guess) }}
          >
            <Needle player={p} />
          </div>
        ))}

        {/* Player Needle */}
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

        .needle-wrapper {
          position: absolute;
          top: 5px;
          height: calc(100% - 8px);
        }

        .needle-teammate {
          transition: 180ms transform ease-in-out;
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
