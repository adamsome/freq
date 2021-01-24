import { useState } from 'react'
import { isLeftClick } from '../util/dom'
import useEvent from './use-event'
import useLayoutEffect from './use-passive-layout-effect'
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

  // Position during a drag base on how far the cursor has moved
  const [dragPosition, setDragPosition] = useState(0)
  // Time the drag started; null if not currently dragging
  const [dragStartAt, setDragStartAt] = useState<Date | null>(null)
  // Track the last cursor position since dragPosition was last updated
  const [prevCursorPosition, setPrevCursorPosition] = useState(0)
  // Non-drag position
  const [position, setPosition] = useState(() => initPosition)

  /** Clamp position to the bounds of the target */
  const clamp = (p: number) => Math.max(0, Math.min(p, length))

  const initPosition =
    typeof opts.initialPosition === 'number'
      ? opts.initialPosition
      : opts.initialPosition(length)

  // When initial position changes, reset the offset so the the position
  // is set exactly to that set, not with the added offset
  useLayoutEffect(() => {
    setPosition(clamp(initPosition))
  }, [initPosition])

  const currentPosition = dragStartAt == null ? position : clamp(dragPosition)

  // Handle drag events

  const handleStart = (cursorPosition?: number) => {
    setDragStartAt(new Date())
    setDragPosition(position)

    if (cursorPosition) setPrevCursorPosition(cursorPosition)

    if (opts.onStart) {
      opts.onStart(length, currentPosition)
    }
  }

  const handleMove = (cursorPosition: number) => {
    if (!dragStartAt) return

    // Add difference since the last position to the offset
    setDragPosition(cursorPosition - prevCursorPosition + dragPosition)
    setPrevCursorPosition(cursorPosition)

    if (opts.onMove) {
      // Only set our output guess (which triggers callback event) after delay
      const msSinceDragStart = new Date().getTime() - dragStartAt.getTime()
      if (msSinceDragStart > opts.delayMS) {
        opts.onMove(length, currentPosition)
      }
    }
  }

  const handleEnd = () => {
    // Update position with where the drag ended (within the bounding box)
    setPosition(clamp(dragPosition))
    setDragStartAt(null)

    if (opts.onEnd) {
      opts.onEnd(length, currentPosition)
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

  return { position: currentPosition, length, dragging: dragStartAt !== null }
}
