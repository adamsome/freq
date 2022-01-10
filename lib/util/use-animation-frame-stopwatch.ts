/*! vydimitrov/react-countdown-circle-timer v2.5.4 | MIT License | https://github.com/vydimitrov/react-countdown-circle-timer */
import { useCallback, useRef, useState } from 'react'
import usePassiveLayoutEffect from './use-passive-layout-effect'

export type AnimationFrameStopwatchFinishOptions =
  | boolean
  | {
      repeat?: boolean
      delay?: number
    }

interface UseAnimationFrameStopwatchProps {
  running: boolean
  duration: number
  /** Update the result every x seconds */
  updateInterval?: number
  onFinish?: (seconds: number) => void | AnimationFrameStopwatchFinishOptions
}

type UseAnimationFrameStopwatchResult = [elapsed: number, reset: () => void]

export const useAnimationFrameStopwatch = ({
  running,
  duration,
  updateInterval = 0,
  onFinish,
}: UseAnimationFrameStopwatchProps): UseAnimationFrameStopwatchResult => {
  const [elapsed, setElapsed] = useState(0)

  const elapsedRef = useRef(0)
  // Keep in ms to avoid summing up floating point numbers
  const totalElapsedRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const prevTimeRef = useRef<number | null>(null)
  const repeatTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const loop = (timeInMS: number) => {
    const time = timeInMS / 1000

    if (prevTimeRef.current === null) {
      prevTimeRef.current = time
      animationFrameRef.current = requestAnimationFrame(loop)
      return
    }

    // Get current elapsed time
    const timeDelta = time - prevTimeRef.current
    const rawElapsed = elapsedRef.current + timeDelta

    // Update refs with the current elapsed time
    prevTimeRef.current = time
    elapsedRef.current = rawElapsed

    const finished = typeof duration === 'number' && rawElapsed >= duration
    setElapsed(
      finished
        ? duration
        : // Result in seconds elapsed, restricted by the update interval
        updateInterval === 0
        ? rawElapsed
        : ((rawElapsed / updateInterval) | 0) * updateInterval
    )

    // repeat animation if not completed
    if (!finished) {
      animationFrameRef.current = requestAnimationFrame(loop)
    }
  }

  const cleanup = () => {
    animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current)
    repeatTimeoutRef.current && clearTimeout(repeatTimeoutRef.current)
    prevTimeRef.current = null
  }

  const reset = useCallback(() => {
    cleanup()

    elapsedRef.current = 0
    setElapsed(0)

    if (running) {
      animationFrameRef.current = requestAnimationFrame(loop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  usePassiveLayoutEffect(() => {
    if (duration && elapsed >= duration) {
      totalElapsedRef.current += duration * 1000

      const opts = onFinish?.(totalElapsedRef.current / 1000) ?? {}

      const { repeat, delay } =
        typeof opts === 'boolean' || opts == null
          ? { repeat: opts, delay: 0 }
          : opts

      if (repeat) {
        repeatTimeoutRef.current = setTimeout(
          () => reset(),
          (delay ?? 0) * 1000
        )
      }
    }
  }, [elapsed, duration])

  usePassiveLayoutEffect(() => {
    if (running) {
      animationFrameRef.current = requestAnimationFrame(loop)
    }

    return cleanup
    // start animation over when seconds or updateInterval change
  }, [running, duration])

  return [elapsed, reset]
}
