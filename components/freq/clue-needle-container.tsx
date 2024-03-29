import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { partition } from '../../lib/util/array'
import { useDrag1D } from '../../lib/util/use-drag-1d'
import { useFreqGame } from '../../lib/util/use-game'
import { useThrottle } from '../../lib/util/use-throttle'
import Needle from './needle'
import NeedleAverage from './needle-average'

type Props = typeof defaultProps & {
  children: ReactNode
  onGuessChange: (guess: number) => void
}

const defaultProps = {}

const NEEDLE_WIDTH = 32
const NEEDLE_TEAMMATE_WIDTH = 24
const CHANGE_FPS = 2

const ClueNeedleContainer = ({ children, onGuessChange }: Props) => {
  const { game } = useFreqGame()

  const meterWrapperRef = useRef<HTMLDivElement>(null)
  const needleRef = useRef<HTMLDivElement>(null)

  // Throttle the guess change callback
  const [guess, setGuess] = useThrottle<number | null>(null, CHANGE_FPS)

  // Update guess when set and guesses exist (otherwise disallowed)
  useEffect(() => {
    if (guess != null) onGuessChange(guess)
  }, [guess, onGuessChange])

  const guesses = game?.playerGuesses ?? []
  const player = game?.currentPlayer
  const partitionedPlayers = partition((p) => p.id === player?.id, guesses)
  const [currentPlayerGuesses, otherPlayerGueses] = partitionedPlayers

  const initialGuess = currentPlayerGuesses[0]?.value ?? 0.5
  const hasGuesses = (guesses?.length ?? 0) > 0
  const isGuessing = game?.phase === 'guess'
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

  if (!game) return null

  const buildGuessTranslate = (
    guess: number,
    offset = (NEEDLE_WIDTH - NEEDLE_TEAMMATE_WIDTH) / 2
  ) => {
    const x = length * guess + offset
    return `translateX(${x}px)`
  }

  const positionClass = 'absolute top-1 h-[7.5rem] sm:h-[9.5rem]'

  const teammateGuesses = otherPlayerGueses.map((player, i) => {
    const transform = buildGuessTranslate(player.value)
    return (
      <div
        key={i}
        className={positionClass + ' transition-transform'}
        style={{ transform }}
      >
        <Needle player={player} />
      </div>
    )
  })

  return (
    <>
      <div ref={meterWrapperRef} className="relative h-full w-full">
        {children}

        {game.averageGuess != null && (
          <NeedleAverage
            transform={buildGuessTranslate(game.averageGuess, 0)}
          />
        )}

        {teammateGuesses}

        {/* Player Needle */}
        {hasGuesses && currentPlayerGuesses.length > 0 && (
          <div ref={needleRef} className={positionClass}>
            <Needle player={currentPlayerGuesses[0]} size="lg" />
          </div>
        )}
      </div>
    </>
  )
}

ClueNeedleContainer.defaultProps = defaultProps

export default ClueNeedleContainer
