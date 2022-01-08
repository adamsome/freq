import { BlowGame } from '../types/blow.types'

export function createPrepBlowMatchChanges(): Partial<BlowGame> {
  return {
    phase: 'prep' as const,
    actions: [],
  }
}

export default function prepBlowMatch(game: BlowGame): BlowGame {
  const changes = createPrepBlowMatchChanges()
  return { ...game, ...changes }
}
