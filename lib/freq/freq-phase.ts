import { FreqPhase } from '../../types/freq.types'
import { nth } from '../../util/array'

export const FREQ_PHASES: FreqPhase[] = [
  'prep',
  'choose',
  'guess',
  'direction',
  'reveal',
  'win',
]

export function nextFreqPhase(phase: FreqPhase, offset = 1): FreqPhase {
  const i = FREQ_PHASES.findIndex((p) => p === phase)
  return nth((i + offset) % FREQ_PHASES.length, FREQ_PHASES)
}

const freePhases: FreqPhase[] = ['prep', 'reveal', 'win']

export function isFreeFreqPhase(phase: FreqPhase): boolean {
  return freePhases.includes(phase)
}

const guessingPhases: FreqPhase[] = ['guess', 'direction']

export function isGuessingFreqPhase(phase: FreqPhase): boolean {
  return guessingPhases.includes(phase)
}
