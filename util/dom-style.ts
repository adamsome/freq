import { CSSProperties } from 'react'
import colorDict from '../lib/color-dict'
import gradientDict from '../lib/gradient-dict'

export const styleColor = (
  p?: { color?: string } | false | null,
  lit = false
) => {
  if (!p) return undefined
  const color = colorDict[p.color ?? 0]?.hex
  return {
    color: lit ? 'var(--body-light)' : color,
    background: lit ? color : undefined,
  }
}

export const styleLinearGradient = (gradient: string): CSSProperties => {
  const colors = gradientDict[gradient]
  const n = colors?.length
  if (!n || n === 0) {
    return { color: `var(--body)` }
  }
  const background =
    n === 1 ? colors[0] : `linear-gradient(to right, ${colors.join(', ')})`
  return { background, backgroundPosition: 'center', backgroundSize: '120%' }
}
