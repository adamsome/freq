import { CwdCodesInfo, CwdCodeState } from '../types/cwd.types'
import { LanguageCode } from '../types/game.types'
import { shuffle } from '../util/random'
import CWD_CODES from './cwd-codes'

export default function generateCwdCodesInfo(
  turn: 1 | 2,
  language: LanguageCode = 'en'
): CwdCodesInfo {
  const availableCodes = CWD_CODES[language]
  const shuffledCodes = shuffle(availableCodes.slice(0))
  const code_words = shuffledCodes.slice(0, 25)
  const states = turn === 1 ? TEAM_1_FIRST_STATES : TEAM_2_FIRST_STATES
  const code_states = shuffle(states)
  return { code_words, code_states }
}

const TEAM_1_FIRST_STATES: CwdCodeState[] = [
  -1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
]

const TEAM_2_FIRST_STATES: CwdCodeState[] = [
  -1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
]
