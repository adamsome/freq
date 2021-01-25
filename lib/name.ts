import { randomItem } from '../util/array'

/** If this retry attempt is 1 or more add a suffix, e.g. 'Name (3)` */
function buildName(name: string, retry: number): string {
  const suffix = `${retry ? ` (${retry})` : ''}`
  return `${name}${suffix}`
}

export function randomName(excludeNames: string[] = [], retry = 0): string {
  if (retry > 5) {
    // Short-curcuit retries at 5
    return 'No Name'
  }
  const availableNames = nameSet.filter((n) => {
    return !excludeNames.includes(buildName(n, retry))
  })

  if (availableNames.length === 0) {
    // All names in base list used, retry using the suffix above
    return randomName(excludeNames, retry + 1)
  }

  return buildName(randomItem(availableNames), retry)
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
