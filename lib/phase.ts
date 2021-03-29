import { CwdPhase } from '../types/cwd.types'
import { FreqPhase, FREQ_PHASES } from '../types/freq.types'
import { CanChangePsychicTo, CommonPhase } from '../types/game.types'
import { nth } from '../util/array'

export function nextFreqPhase(phase: FreqPhase, offset = 1): FreqPhase {
  const i = FREQ_PHASES.findIndex((p) => p === phase)
  const x = (i + offset) % FREQ_PHASES.length
  return nth(x, FREQ_PHASES)
}

const freePhases: (FreqPhase | CwdPhase)[] = ['prep', 'reveal', 'win']

export function isFreePhase(phase: FreqPhase | CwdPhase): boolean {
  return freePhases.includes(phase)
}

const guessingPhases: (FreqPhase | CwdPhase)[] = ['guess', 'direction']

export function isGuessingPhase(phase: FreqPhase | CwdPhase): boolean {
  return guessingPhases.includes(phase)
}

export function canChangePsychicTo(phase: CommonPhase): CanChangePsychicTo {
  switch (phase) {
    case 'prep':
    case 'win':
      return 'any'
    case 'choose':
    case 'reveal':
      return 'same_team'
    default:
      return 'none'
  }
}
