import React, { useEffect, useRef } from 'react'
import { useDrag1D } from '../hooks/use-drag-1d'
import { useThrottle } from '../hooks/use-throttle'
import { Clue } from '../types/game.types'
import { PlayerWithGuess } from '../types/player.types'
import MeterBackboard from './meter-backboard'
import Needle from './needle'

type Props = typeof defaultProps & {
  clue: Clue
  players: PlayerWithGuess[]
  onGuessChange: (guess: number) => void
}

const defaultProps = {}

const NEEDLE_WIDTH = 32
const NEEDLE_TEAMMATE_WIDTH = 24
const CHANGE_FPS = 2

const Meter = ({ clue, players, onGuessChange }: Props) => {
  const meterWrapperRef = useRef<HTMLDivElement>(null)
  const needleRef = useRef<HTMLDivElement>(null)

  // Throttle the guess change callback
  const [guess, setGuess] = useThrottle<number | null>(null, CHANGE_FPS)

  useEffect(() => {
    if (guess != null) onGuessChange(guess)
  }, [guess])

  const initialGuess = players[0]?.guess?.value

  // Track the width and drag position of the meter
  const { position, length } = useDrag1D(meterWrapperRef, 'x', {
    initialPosition: (w) => (initialGuess != null ? w * initialGuess : w / 2),
    lengthOffset: NEEDLE_WIDTH,
    delayMS: 1000 / CHANGE_FPS,
    onMove: (width, x) => setGuess(x / width),
    onEnd: (w, x) => setGuess(x / w),
  })

  // Update needle transform when its x position changes
  useEffect(() => {
    if (needleRef.current)
      needleRef.current.style.transform = `translateX(${position}px)`
  }, [position])

  const buildTeammateNeedleTranslate = (teammateGuess: number) => {
    const needleTeammateWidthDiff = NEEDLE_WIDTH - NEEDLE_TEAMMATE_WIDTH
    const x = length * teammateGuess + needleTeammateWidthDiff / 2
    return `translateX(${x}px)`
  }

  return (
    <>
      <div ref={meterWrapperRef} className="wrapper">
        <MeterBackboard clue={clue}></MeterBackboard>

        {/* Teammate Needles */}
        {players.slice(1).map((p, i) => (
          <div
            key={i}
            className="needle-wrapper needle-teammate"
            style={{
              transform: buildTeammateNeedleTranslate(p.guess.value),
            }}
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
