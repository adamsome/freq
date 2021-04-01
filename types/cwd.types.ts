import { CommonGame, CommonGameView, PlayerView } from './game.types'
import { Dict } from './object.types'

export interface CwdPlayerStats {
  updated_at: string
  /** User ID */
  id: string
  /** Games played */
  g: number
  /** Wins */
  w: number
  /** Rounds as psychic */
  pn: number
  /** Points as psychic */
  pp: number
  /** Rounds as guesser */
  gn: number
  /** Points as guesser */
  gp: number
}

export const CWD_PHASES = ['prep', 'guess', 'win'] as const

export type CwdPhase = typeof CWD_PHASES[number]

export type CwdCodeState =
  /** Black ball (auto-lose) */
  | -1
  /** No team */
  | 0
  /** Team 1 */
  | 1
  /** Team 2 */
  | 2

export interface CwdCodeView {
  word: string
  icons: string[]
  revealed?: CwdCodeState
  state?: CwdCodeState
  selected?: boolean
  clickable?: boolean
  level?: number
  lit?: boolean
  brokenWord: string
  brokenLength: number
}

export interface CwdCodesInfo {
  code_words: string[]
  code_states: CwdCodeState[]
}

export interface CwdSettings {
  designated_psychic?: boolean
}

export interface CwdLastAct {
  at: string
  team: 1 | 2
  word?: string
  state?: CwdCodeState
  correct?: boolean
  win?: boolean
  pass?: boolean
}

export interface CwdGame extends CommonGame, CwdCodesInfo {
  settings?: CwdSettings
  /* Team 1's current psychic */
  psychic_1?: string
  /* Team 2's current psychic */
  psychic_2?: string
  /* List of the most recent psychics */
  psychic_history: string[]
  /* List of code indices that have been revealed by either team */
  code_reveals: number[]
  /* List of code indices by player that they have tapped this match */
  visited?: Dict<number[]>
  /* List of code indices that have been guessed by team 1 this round */
  team_1_guesses: number[]
  /* List of code indices that have been guessed by team 2 this round */
  team_2_guesses: number[]
  /* Info about the last action, which team, code word, state, win, pass etc. */
  last_act?: CwdLastAct
  phase: CwdPhase
  stats?: Dict<CwdPlayerStats>
}

export interface CwdGameView
  extends Omit<CommonGameView, 'phase'>,
    Omit<CwdGame, keyof CwdCodesInfo | 'players'> {
  codes: CwdCodeView[]
  winner?: 1 | 2
}

export type FullCwdGameView = Omit<CwdGameView, 'currentPlayer'> &
  CwdCodesInfo & {
    currentPlayer: PlayerView
  }
