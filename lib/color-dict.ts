import { Dict } from '../types/object.model'
import { randomItem } from '../util/array'
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
  return randomItem(teamColors)
}

const colorDict: Dict<ColorDef> = {
  'Munsell Red': { team: 1, hex: '#f2003c', list: 13, assign: 0 },
  Coral: { team: 1, hex: '#FF7F50', list: 4, assign: 1 },
  'Medium Violet Red': { team: 1, hex: '#C71585', list: 15, assign: 2 },
  'Orange Red': { team: 1, hex: '#FF4500', list: 1, assign: 3 },
  'Indian Red': { team: 1, hex: '#CD5C5C', list: 6, assign: 4 },
  Carmine: { team: 1, hex: '#960018', list: 10, assign: 5 },
  Redwood: { team: 1, hex: '#A45953', list: 7, assign: 6 },
  Scarlet: { team: 1, hex: '#ed1c24', list: 0, assign: 7 },
  Ruby: { team: 1, hex: '#e0115f', list: 14, assign: 8 },
  'Fire Brick': { team: 1, hex: '#b22222', list: 11, assign: 9 },
  Salmon: { team: 1, hex: '#FA8072', list: 5, assign: 10 },
  'Pale Violet Red': { team: 1, hex: '#DB7093', list: 16, assign: 11 },
  Maroon: { team: 1, hex: '#841617', list: 9, assign: 12 },
  Tomato: { team: 1, hex: '#FF6347', list: 3, assign: 13 },
  'Phych Red': { team: 1, hex: '#C40234', list: 12, assign: 14 },
  'Chili Red': { team: 1, hex: '#e23d28', list: 2, assign: 15 },
  'Munsell Blue': { team: 2, hex: '#0093AF', list: 16, assign: 0 },
  'International Klein Blue': { team: 2, hex: '#0040e1', list: 6, assign: 1 },
  Azure: { team: 2, hex: '#007FFF', list: 9, assign: 2 },
  'Savoy Blue': { team: 2, hex: '#4B61D1', list: 3, assign: 3 },
  Capri: { team: 2, hex: '#00BFFF', list: 10, assign: 4 },
  'Bayern Blue': { team: 2, hex: '#0066b2', list: 8, assign: 5 },
  Indigo: { team: 2, hex: '#3F00FF', list: 5, assign: 6 },
  Turquoise: { team: 2, hex: '#40E0D0', list: 11, assign: 7 },
  'Teal Blue': { team: 2, hex: '#367588', list: 17, assign: 8 },
  'Air Superiority Blue': { team: 2, hex: '#72A0C1', list: 1, assign: 9 },
  Cerulean: { team: 2, hex: '#2a52be', list: 7, assign: 10 },
  'Cadet Blue': { team: 2, hex: '#5F9EA0', list: 15, assign: 11 },
  'Cornflower Blue': { team: 2, hex: '#6495ED', list: 2, assign: 12 },
  Iris: { team: 2, hex: '#5A4FCF', list: 4, assign: 13 },
}

export default colorDict
