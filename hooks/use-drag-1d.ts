import { useState } from 'react'
import { isLeftClick } from '../util/dom'
import useEvent from './use-event'
import useSize from './use-size'

interface UseDrag1DOptions {
  initialPosition: number | ((length: number) => number)
  lengthOffset: number
  delayMS: number
  onStart?: (width: number, position: number) => void
  onMove?: (width: number, position: number) => void
  onEnd?: (width: number, position: number) => void
}

const defaultOptions: UseDrag1DOptions = {
  initialPosition: 0,
  lengthOffset: 0,
  delayMS: 0,
}

export const useDrag1D = <T extends HTMLElement>(
  target: React.RefObject<T>,
  /** 'x' is an alias of 'horizontal'; same for 'y' & 'vertical' */
  orientation: 'horizontal' | 'x' | 'vertical' | 'y',
  options?: Partial<UseDrag1DOptions>
) => {
  const opts = { ...defaultOptions, ...options }

  const [rawLength] = useSize(target)
  const length = rawLength - opts.lengthOffset

  // How far the target has been dragged from center position
  const [offset, setOffset] = useState(0)

  const initPosition =
    typeof opts.initialPosition === 'number'
      ? opts.initialPosition
      : opts.initialPosition(length)

  const realPosition = initPosition + offset
  // Clamp position to the bounds of the target
  const position = Math.max(0, Math.min(realPosition, length))

  // Handle drag events

  const [dragStartAt, setDragStartAt] = useState<Date | null>(null)
  const [prevCursorPosition, setPrevCursorPosition] = useState(0)

  const handleStart = (cursorPosition?: number) => {
    setDragStartAt(new Date())

    if (cursorPosition) setPrevCursorPosition(cursorPosition)

    if (opts.onStart) {
      opts.onStart(length, position)
    }
  }

  const handleMove = (cursorPosition: number) => {
    if (!dragStartAt) return

    // Add difference since the last position to the offset
    setOffset(cursorPosition - prevCursorPosition + offset)
    setPrevCursorPosition(cursorPosition)

    if (opts.onMove) {
      // Only set our output guess (which triggers callback event) after delay
      const msSinceDragStart = new Date().getTime() - dragStartAt.getTime()
      if (msSinceDragStart > opts.delayMS) {
        opts.onMove(length, position)
      }
    }
  }

  const handleEnd = () => {
    setDragStartAt(null)

    // Reset offset if the real position is out of bounds of the target
    if (realPosition < 0) {
      setOffset(-initPosition)
    } else if (realPosition > length) {
      setOffset(initPosition)
    }

    if (opts.onEnd) {
      opts.onEnd(length, position)
    }
  }

  // Set up event listeners

  const isHoriz = orientation === 'horizontal' || orientation === 'x'
  const mousePos = (e: MouseEvent) => (isHoriz ? e.pageX : e.pageY)
  const touchPos = (e: TouchEvent) =>
    isHoriz ? e.touches[0].pageX : e.touches[0].pageY

  useEvent(
    target,
    'mousedown',
    (e) => isLeftClick(e) && handleStart(mousePos(e))
  )
  useEvent(target, 'mousemove', (e) => handleMove(mousePos(e)))
  useEvent(target, 'mouseup', handleEnd)

  useEvent(target, 'touchstart', (e) => handleStart(touchPos(e)))
  useEvent(target, 'touchmove', (e) => handleMove(touchPos(e)))
  useEvent(target, 'touchend', handleEnd)

  return { position, length }
}
