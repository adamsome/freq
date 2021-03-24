import { Guess } from '../types/game.types'
import { Dict } from '../types/object.types'

export function getGuessesLocked(dict: Dict<Guess> = {}): Guess[] {
  return Object.values(dict).filter((g) => g.locked === true)
}

export function getGuessesSet(dict: Dict<Guess> = {}): Guess[] {
  return Object.values(dict).filter((g) => g.value != null)
}
