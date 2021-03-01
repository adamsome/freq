import React, { useEffect, useRef } from 'react'
import { useDrag1D } from '../hooks/use-drag-1d'
import useGame from '../hooks/use-game'
import { useThrottle } from '../hooks/use-throttle'
import { partition } from '../util/array'
import Needle from './needle'
import NeedleAverage from './needle-average'

type Props = typeof defaultProps & {
  children: React.ReactNode
  onGuessChange: (guess: number) => void
}

const defaultProps = {}

const NEEDLE_WIDTH = 32
const NEEDLE_TEAMMATE_WIDTH = 24
const CHANGE_FPS = 2

const ClueMeter = ({ children, onGuessChange }: Props) => {
  const { game } = useGame()
  if (!game) return null

  const meterWrapperRef = useRef<HTMLDivElement>(null)
  const needleRef = useRef<HTMLDivElement>(null)

  // Throttle the guess change callback
  const [guess, setGuess] = useThrottle<number | null>(null, CHANGE_FPS)

  // Update guess when set and guesses exist (otherwise disallowed)
  useEffect(() => {
    if (guess != null) onGuessChange(guess)
  }, [guess])

  const guesses = game.playerGuesses
  const player = game?.currentPlayer
  const partitionedPlayers = partition((p) => p.id === player?.id, guesses)
  const [currentPlayerGuesses, otherPlayerGueses] = partitionedPlayers

  const initialGuess = currentPlayerGuesses[0]?.value ?? 0.5
  const hasGuesses = guesses.length > 0
  const isGuessing = game.phase === 'guess'
  const disable =
    !hasGuesses || currentPlayerGuesses[0]?.locked === true || !isGuessing

  // Track the width and drag position of the meter
  const { position, length } = useDrag1D(meterWrapperRef, 'x', {
    initialPosition: (w) => (initialGuess != null ? w * initialGuess : w / 2),
    lengthOffset: NEEDLE_WIDTH,
    delayMS: 1000 / CHANGE_FPS,
    disable,
    onMove: (width, x) => setGuess(x / width),
    onEnd: (w, x) => setGuess(x / w),
  })

  // Update needle transform when its x position changes
  useEffect(() => {
    if (needleRef.current)
      needleRef.current.style.transform = `translateX(${position}px)`
  }, [position])

  const buildGuessTranslate = (
    guess: number,
    offset = (NEEDLE_WIDTH - NEEDLE_TEAMMATE_WIDTH) / 2
  ) => {
    const x = length * guess + offset
    return `translateX(${x}px)`
  }

  const teammateGuesses = otherPlayerGueses.map((player, i) => {
    const transform = buildGuessTranslate(player.value)
    return (
      <div
        key={i}
        className="absolute top-1 h-30 sm:h-38 transition-transform"
        style={{ transform }}
      >
        <Needle player={player} />
      </div>
    )
  })

  return (
    <>
      <div ref={meterWrapperRef} className="relative w-full h-full">
        {children}

        {game.averageGuess != null && (
          <NeedleAverage
            transform={buildGuessTranslate(game.averageGuess, 0)}
          />
        )}

        {teammateGuesses}

        {/* Player Needle */}
        {hasGuesses && currentPlayerGuesses.length > 0 && (
          <div ref={needleRef} className="absolute top-1 h-30 sm:h-38">
            <Needle player={currentPlayerGuesses[0]} size="lg" />
          </div>
        )}
      </div>
    </>
  )
}

ClueMeter.defaultProps = defaultProps

export default ClueMeter
