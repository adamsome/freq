import { useMemo, useRef } from 'react'
import { convertHexToRGB, createRGBStyle, RGBColor } from './dom-style'
import {
  AnimationFrameStopwatchFinishOptions,
  useAnimationFrameStopwatch,
} from './use-animation-frame-stopwatch'

type ColorAndTiming<T = string> = [T, number?]

type UseAnimatedTimerSpinnerColorOptions = string | ColorAndTiming[]

export interface UseAnimatedTimerSpinnerProps {
  running?: boolean
  /** Size of timer circle in pixels */
  size?: number
  /** Width of circle outline */
  strokeWidth?: number
  /** Duration of timer */
  duration: number
  colors?: UseAnimatedTimerSpinnerColorOptions
  onFinish?: (seconds: number) => void | AnimationFrameStopwatchFinishOptions
}

type UseAnimatedTimerSpinnerResult = [
  elapsed: number,
  svgProps: UseAnimatedTimerSpinnerSvgProps,
  reset: () => void
]

interface UseAnimatedTimerSpinnerSvgProps {
  size: number
  path: string
  circumference: number
  stroke: string
  strokeWidth: number
  strokeDashoffset: number
}

const DEFAULT_COLOR_OPTS: UseAnimatedTimerSpinnerColorOptions = [
  ['#06b6d4', 0.5],
  ['#00ade8', 0.0666],
  ['#4fa0f3', 0.0666],
  ['#8c8eee', 0.0666],
  ['#bf76d7', 0.0666],
  ['#e35ab0', 0.0666],
  ['#f4447c', 0.0666],
  ['#ef4444'],
]

export const useTimerSpinnerAnimation = ({
  running = true,
  duration: rawDuration,
  size = 24,
  strokeWidth = 3,
  colors = DEFAULT_COLOR_OPTS,
  onFinish,
}: UseAnimatedTimerSpinnerProps): UseAnimatedTimerSpinnerResult => {
  const { duration } = useRef({ duration: rawDuration }).current

  const { path, circumference } = useMemo(
    () => buildCirclePath(size, strokeWidth),
    [size, strokeWidth]
  )

  const normalizedColors = useMemo(
    () => getNormalizedColors(colors, duration),
    [colors, duration]
  )

  const [elapsed, reset] = useAnimationFrameStopwatch({
    running,
    duration,
    onFinish,
  })

  const svgProps: UseAnimatedTimerSpinnerSvgProps = {
    size,
    path,
    circumference,
    stroke: getStroke(normalizedColors, elapsed),
    strokeWidth,
    strokeDashoffset: linearEase(elapsed, 0, circumference, duration),
  }

  return [elapsed, svgProps, reset]
}

const buildCirclePath = (size: number, strokeWidth: number) => {
  const outerRadius = size / 2
  const w = strokeWidth / 2
  const radius = outerRadius - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const path =
    `m ${outerRadius},${w} ` +
    `a ${radius},${radius} 0 1,0 0,${radius * 2} ` +
    `a ${radius},${radius} 0 1,0 0,-${radius * 2}`
  return { path, circumference }
}

interface NormalizedColors {
  r: number
  g: number
  b: number
  opacity: 1
  colorStartTime?: number
  colorEndTime: number
  duration?: number
  goalR?: number
  goalG?: number
  goalB?: number
}

const getNormalizedColors = (
  colorOpts: UseAnimatedTimerSpinnerColorOptions,
  duration: number
): NormalizedColors[] => {
  const hexColors: ColorAndTiming[] =
    typeof colorOpts === 'string' ? [[colorOpts, 1]] : colorOpts

  const rgbOpts: ColorAndTiming<RGBColor>[] = hexColors.map((c) => {
    return [convertHexToRGB(c[0]), c[1]]
  })

  let total = 0

  return rgbOpts.map(([rgb, timing], index) => {
    const isLast = rgbOpts.length === index + 1
    if (total >= duration || isLast) {
      total = duration
      return { ...rgb, colorEndTime: total }
    }

    const colorStartTime = total
    const colorEndTimeTemp =
      timing !== undefined ? colorStartTime + timing * duration : duration
    const colorEndTime =
      colorEndTimeTemp >= duration ? duration : colorEndTimeTemp

    const nextRGB = rgbOpts[index + 1][0]
    const goals = {
      goalR: nextRGB.r - rgb.r,
      goalG: nextRGB.g - rgb.g,
      goalB: nextRGB.b - rgb.b,
    }

    total = colorEndTime

    return {
      ...rgb,
      ...goals,
      colorStartTime,
      colorEndTime,
      duration: colorEndTime - colorStartTime,
    }
  })
}

const getStroke = (colors: NormalizedColors[], s: number) => {
  if (colors.length === 1) {
    return createRGBStyle(colors[0])
  }

  const color = colors.find(({ colorEndTime }) => s <= colorEndTime)
  if (!color || color?.duration === undefined) {
    return createRGBStyle(color ?? { r: 0, b: 0, g: 0, opacity: 1 })
  }

  const currentColorStartTime = s - (color.colorStartTime ?? 0)
  const r =
    linearEase(currentColorStartTime, color.r, color.goalR, color.duration) | 0
  const g =
    linearEase(currentColorStartTime, color.g, color.goalG, color.duration) | 0
  const b =
    linearEase(currentColorStartTime, color.b, color.goalB, color.duration) | 0

  return createRGBStyle({ r, g, b, opacity: color.opacity })
}

const linearEase = (time: number, start: number, goal = 0, duration = 0) => {
  if (duration === 0) {
    return goal
  }

  const currentTime = time / duration
  return start + goal * currentTime
}
