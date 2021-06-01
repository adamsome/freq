import {
  CommonGame,
  CommonGameView,
  CommonPhase,
  PlayerView,
  PlayerWithGuess,
} from './game.types'
import { Dict } from './object.types'

export interface FreqPlayerStats {
  updated_at: string
  /** User ID */
  id: string
  /** Games played */
  gp: number
  /** Wins */
  w: number
  /** Rounds as psychic */
  pn: number
  /** Rounds as psychic where team gets 4 points */
  p4: number
  /** Rounds as psychic where team gets 3 points */
  p3: number
  /** Rounds as psychic where team gets 2 points */
  p2: number
  /** Total number of guesses */
  gn: number
  /** Number of player 4 point guesses */
  g4: number
  /** Number of player 3 point guesses */
  g3: number
  /** Number of player 2 point guesses */
  g2: number
  /** Number of team 4 point guesses */
  gt4: number
  /** Number of team 3 point guesses */
  gt3: number
  /** Number of team 2 point guesses */
  gt2: number
  /** Total number of direction guesses */
  dn: number
  /** Number of correct player direction guesses */
  d1: number
  /** Number of correct team direction guesses */
  dt1: number
}

export interface FreqClue {
  left: string
  right: string
  gradient: string
}

export const FREQ_PHASES: readonly CommonPhase[] = [
  'prep',
  'choose',
  'guess',
  'direction',
  'reveal',
  'win',
] as const

export type FreqPhase = typeof FREQ_PHASES[number]

export const freqClueDifficulties = ['easy', 'hard']
export type FreqClueDifficulty = typeof freqClueDifficulties[number]
export type FreqClueDifficultyOrAll = FreqClueDifficulty | 'all'

export interface FreqSettings {
  designated_psychic?: boolean
  difficulty?: FreqClueDifficulty
}

export interface FreqGame extends CommonGame {
  settings?: FreqSettings
  /* Current turn team's psychic */
  psychic: string
  next_psychic?: string
  psychic_counts?: Dict<number>
  /* List of the most recent psychics */
  psychic_history: string[]
  clues: FreqClue[]
  clue_selected?: number
  clue_history?: number[]
  target?: number
  target_width: number
  phase: FreqPhase
  stats?: Dict<FreqPlayerStats>
}

export interface FreqGameView
  extends CommonGameView,
    Omit<FreqGame, 'players'> {
  cluesToShow: FreqClue[]
  playerGuesses: PlayerWithGuess[]
  playerDirections: PlayerWithGuess[]
  averageGuess?: number
}

export type CurrentFreqGameView = Omit<FreqGameView, 'currentPlayer'> & {
  currentPlayer: PlayerView
}
