import colorDict from '../lib/color-dict'
import { Player } from '../types/player.types'

export const colorPlayer = (p?: Player | null, lit = false) => {
  if (!p) return undefined
  const color = colorDict[p.color ?? 0]?.hex
  return {
    color: lit ? 'var(--body-light)' : color,
    background: lit ? color : undefined,
  }
}
