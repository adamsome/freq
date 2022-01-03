import { BlowGame } from '../types/blow.types'

export function createPrepCwdMatchChanges(): Partial<BlowGame> {
  return {
    phase: 'prep' as const,
  }
}

export default function prepCwdMatch(game: BlowGame): BlowGame {
  const changes = createPrepCwdMatchChanges()
  return { ...game, ...changes }
}
