import { Phase } from '../types/game.types'
import { nth } from '../util/array'

export const PHASES: Phase[] = [
  'prep',
  'choose',
  'guess',
  'direction',
  'reveal',
  'win',
]

export function nextPhase(phase: Phase, offset = 1): Phase {
  const i = PHASES.findIndex((p) => p === phase)
  return nth((i + offset) % PHASES.length, PHASES)
}

const freePhases: Phase[] = ['prep', 'reveal', 'win']

export function isFreePhase(phase: Phase): boolean {
  return freePhases.includes(phase)
}

const guessingPhases: Phase[] = ['guess', 'direction']

export function isGuessingPhase(phase: Phase): boolean {
  return guessingPhases.includes(phase)
}
