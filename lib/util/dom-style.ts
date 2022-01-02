import { CSSProperties } from 'react'
import colorDict from '../color-dict'
import gradientDict from '../gradient-dict'

interface StyleColor {
  color: string
  backgroundColor: string | undefined
}

export const styleColor = (
  colorOrHasColor?: string | { color?: string } | false | null,
  lit = 0
): StyleColor | undefined => {
  if (!colorOrHasColor) return undefined
  const colorName =
    typeof colorOrHasColor === 'string'
      ? colorOrHasColor
      : colorOrHasColor.color

  const hex = colorDict[colorName ?? 0]?.hex
  const alpha = lit * 255
  return {
    color: lit > 0.5 ? '#fff' : hex,
    backgroundColor:
      lit > 0 ? `${hex}${Math.round(alpha).toString(16)}` : undefined,
  }
}

interface StyleBorder {
  borderColor: string
}

export const styleBorder = (
  colorOrHasColor?: string | { color?: string } | false | null,
  lit = 1
): StyleBorder | undefined => {
  if (!colorOrHasColor) return undefined
  const colorName =
    typeof colorOrHasColor === 'string'
      ? colorOrHasColor
      : colorOrHasColor.color

  const hex = colorDict[colorName ?? 0]?.hex
  const alpha = lit * 255
  return {
    borderColor: `${hex}${Math.round(alpha).toString(16)}`,
  }
}

export const styleLinearGradient = (
  gradient: string | undefined | false,
  angleOrSide = 'to right',
  backgroundSize = '120%'
): CSSProperties => {
  const colors = gradient ? gradientDict[gradient] : undefined
  const n = colors?.length
  if (!n || n === 0) {
    return { color: `var(--text)` }
  }
  const backgroundImage =
    n === 1
      ? colors?.[0]
      : `linear-gradient(${angleOrSide}, ${colors?.join(', ')})`
  return { backgroundImage, backgroundPosition: 'center', backgroundSize }
}

export const styleLinearGradientText = (
  gradient: string | undefined | false,
  angleOrSide = '-60deg',
  backgroundSize = '300%'
): CSSProperties => {
  const colors = gradient ? gradientDict[gradient] : undefined
  const n = colors?.length
  if (!n || n === 0) {
    return { color: `var(--text)` }
  }
  const backgroundImage =
    n === 1
      ? colors?.[0]
      : `linear-gradient(${angleOrSide}, ${colors?.join(', ')})`
  return {
    backgroundImage,
    backgroundPosition: 'center',
    backgroundSize,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }
}
