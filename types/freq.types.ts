import { Dict } from './object.types'
import {
  PlayerWithGuess,
  Guess,
  Player,
  Command,
  CommandsView,
} from './game.types'

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

export const FREQ_PHASES = [
  'prep',
  'choose',
  'guess',
  'direction',
  'reveal',
  'win',
] as const

export type FreqPhase = typeof FREQ_PHASES[number]

export interface FreqGame {
  room: string
  players: Player[]
  psychic: string
  next_psychic?: string
  clues: FreqClue[]
  clue_selected?: number
  clue_history?: number[]
  psychic_counts?: Dict<number>
  guesses?: Dict<Guess> // TODO: Rename to 'needles'
  directions?: Dict<Guess>
  target?: number
  target_width: number
  match_number: number
  round_number: number
  phase: FreqPhase
  team_turn: 1 | 2
  repeat_turn?: boolean
  score_team_1: number
  score_team_2: number
  stats?: Dict<FreqPlayerStats>
  game_started_at: string
  game_finished_at?: string
  round_started_at?: string
  kicked?: Dict<boolean>
}

export type FreqCommandType =
  | 'change_player_team'
  | 'edit_player'
  | 'toggle_player_leader'
  | 'set_next_psychic'
  | 'set_current_psychic'
  | 'kick_player'
  // Phases
  | 'prep_new_match'
  | 'begin_round'
  | 'select_clue'
  | 'confirm_clue'
  | 'set_guess'
  | 'lock_guess'
  | 'set_direction'
  | 'lock_direction'
  | 'reveal_round_results'
  | 'reveal_match_results'

export interface Header {
  text: string
  color?: string
  colorLit?: number
}

export type FreqCommand = Command<FreqCommandType>

export type FreqCommandsView = CommandsView<FreqCommandType>

export interface FreqGameView extends FreqGame, FreqCommandsView {
  currentPlayer?: Player
  cluesToShow: FreqClue[]
  playerGuesses: PlayerWithGuess[]
  playerDirections: PlayerWithGuess[]
  averageGuess?: number
  canChangePsychicTo: 'any' | 'same_team' | 'none'
  activePlayers: string[]
}

export type CurrentFreqGameView = Omit<FreqGameView, 'currentPlayer'> & {
  currentPlayer: Player
}
