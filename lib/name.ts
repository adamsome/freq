import { randomItem } from '../util/array'

export function randomName(excludeNames?: string[], attempt?: number): string {
  if (attempt ?? 0 > 5) {
    return 'No Name'
  }
  let i = 0
  let name: string | undefined
  // TODO: Very inefficient algorithm, if name list increases, improve
  while (!name && i < nameSet.length) {
    const suffix = `${attempt != null ? ` (${attempt})` : ''}`
    const nextName = `${randomItem(nameSet)}${suffix}`
    if (!excludeNames?.includes(nextName)) {
      return nextName
    }
    i++
  }
  return randomName(excludeNames, (attempt ?? 0) + 1)
}

const nameSet: string[] = [
  'Faraday',
  'Maxwell',
  'Ørsted',
  'Ampère',
  'Coulomb',
  'Hertz',
  'Gauss',
  'Volta',
  'Ritter',
  'Malus',
  'Wolf',
  'Newton',
  'Bacon',
  'Huygens',
]

export default nameSet
