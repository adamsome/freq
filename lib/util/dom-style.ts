import { CSSProperties } from 'react'
import colorDict from '../color-dict'
import gradientDict from '../gradient-dict'

export const styleColor = (
  colorOrHasColor?: string | { color?: string } | false | null,
  bgOpacity = 0,
  borderOpacity?: number
): CSSProperties | undefined => {
  if (!colorOrHasColor) return undefined
  const colorName =
    typeof colorOrHasColor === 'string'
      ? colorOrHasColor
      : colorOrHasColor.color

  const hex = colorDict[colorName ?? 0]?.hex
  const style: CSSProperties = { color: bgOpacity > 0.5 ? '#fff' : hex }

  if (hex && bgOpacity > 0) {
    style.backgroundColor = `${hex}${Math.round(bgOpacity * 255).toString(16)}`
  }

  if (hex && borderOpacity != null && borderOpacity > 0) {
    style.borderColor = `${hex}${Math.round(borderOpacity * 255).toString(16)}`
  }

  return style
}

export const styleBorder = (
  colorOrHasColor?: string | { color?: string } | false | null,
  borderOpacity = 1
): CSSProperties | undefined => {
  if (!colorOrHasColor) return undefined
  const colorName =
    typeof colorOrHasColor === 'string'
      ? colorOrHasColor
      : colorOrHasColor.color

  const hex = colorDict[colorName ?? 0]?.hex
  const alpha = borderOpacity * 255
  return {
    borderColor: hex ? `${hex}${Math.round(alpha).toString(16)}` : undefined,
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

export interface RGBColor {
  r: number
  g: number
  b: number
  opacity: 1
}

export const convertHexToRGB = (hex: string): RGBColor => {
  const rgb = hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
    )
    .substring(1)
    .match(/.{2}/g)
    ?.map((x) => parseInt(x, 16))
  const [r, g, b] = rgb ?? [0, 0, 0]
  return { r, g, b, opacity: 1 }
}

export const createRGBStyle = ({ r, g, b, opacity }: RGBColor) =>
  `rgba(${r}, ${g}, ${b}, ${opacity})`
