import { Dict } from '../types/object.model'
import { objectKeys } from '../util/object'

export type ColorHue = 'red' | 'blue'

export interface ColorDef {
  team?: 1 | 2
  /** Hex color code. */
  hex: string
  /** Order should be should in a listing. */
  list: number
  /** Order should be assigned to a player. */
  assign: number
}

export function assignColor(
  team?: 1 | 2,
  excludeColors?: (string | undefined)[]
): string {
  const allColors = objectKeys(colorDict)
  const teamColors = allColors
    .filter((c) => colorDict[c].team === team)
    .sort((a, b) => colorDict[a].assign - colorDict[b].assign)
  for (const color of teamColors) {
    if (!excludeColors?.includes(color)) {
      return color
    }
  }
  return teamColors[0] ?? allColors[0]
}

const colorDict: Dict<ColorDef> = {
  'Munsell Red': { team: 1, hex: '#f2003c', list: 13, assign: 0 },
  Coral: { team: 1, hex: '#FF7F50', list: 4, assign: 1 },
  'Medium Violet Red': { team: 1, hex: '#C71585', list: 15, assign: 2 },
  Garnet: { team: 1, hex: '#733635', list: 8, assign: 3 },
  Pink: { team: 1, hex: '#ffc0cb', list: 17, assign: 4 },
  'Orange Red': { team: 1, hex: '#FF4500', list: 1, assign: 5 },
  'Indian Red': { team: 1, hex: '#CD5C5C', list: 6, assign: 6 },
  Carmine: { team: 1, hex: '#960018', list: 10, assign: 7 },
  Redwood: { team: 1, hex: '#A45953', list: 7, assign: 8 },
  Scarlet: { team: 1, hex: '#ed1c24', list: 0, assign: 9 },
  Ruby: { team: 1, hex: '#e0115f', list: 14, assign: 10 },
  'Fire Brick': { team: 1, hex: '#b22222', list: 11, assign: 11 },
  Salmon: { team: 1, hex: '#FA8072', list: 5, assign: 12 },
  'Pale Violet Red': { team: 1, hex: '#DB7093', list: 16, assign: 13 },
  Maroon: { team: 1, hex: '#841617', list: 9, assign: 14 },
  Tomato: { team: 1, hex: '#FF6347', list: 3, assign: 15 },
  'Phych Red': { team: 1, hex: '#C40234', list: 12, assign: 16 },
  'Chili Red': { team: 1, hex: '#e23d28', list: 2, assign: 17 },
  'Munsell Blue': { team: 2, hex: '#0093AF', list: 16, assign: 0 },
  Aquamarine: { team: 2, hex: '#7FFFD4', list: 12, assign: 1 },
  'International Klein Blue': { team: 2, hex: '#002fa7', list: 6, assign: 2 },
  Azure: { team: 2, hex: '#007FFF', list: 9, assign: 3 },
  'Powder Blue': { team: 2, hex: '#B0E0E6', list: 14, assign: 4 },
  'Savoy Blue': { team: 2, hex: '#4B61D1', list: 3, assign: 5 },
  Capri: { team: 2, hex: '#00BFFF', list: 10, assign: 6 },
  'Bayern Blue': { team: 2, hex: '#0066b2', list: 8, assign: 7 },
  Indigo: { team: 2, hex: '#3F00FF', list: 5, assign: 8 },
  Turquoise: { team: 2, hex: '#40E0D0', list: 11, assign: 9 },
  'Teal Blue': { team: 2, hex: '#367588', list: 17, assign: 10 },
  'Air Superiority Blue': { team: 2, hex: '#72A0C1', list: 1, assign: 11 },
  Cerulean: { team: 2, hex: '#2a52be', list: 7, assign: 12 },
  'Electric Blue': { team: 2, hex: '#7DF9FF', list: 13, assign: 13 },
  'Cadet Blue': { team: 2, hex: '#5F9EA0', list: 15, assign: 14 },
  'Cornflower Blue': { team: 2, hex: '#6495ED', list: 2, assign: 15 },
  'Baby Blue': { team: 2, hex: '#89CFF0', list: 0, assign: 16 },
  Iris: { team: 2, hex: '#5A4FCF', list: 4, assign: 17 },
}

export default colorDict
