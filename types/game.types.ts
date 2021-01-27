import { Dict } from './object.types'

export interface Player {
  id: string
  name?: string
  team?: 1 | 2
  color?: string
  icon?: string
  leader?: boolean
  score?: number
}

export interface PlayerWithGuess extends Player {
  guess: Guess
}
export interface Clue {
  left: string
  right: string
  gradient: string
}

export const PHASES = [
  'prep',
  'choose',
  'guess',
  'direction',
  'reveal',
  'win',
] as const

export type Phase = typeof PHASES[number]

export interface Guess {
  value: number
  locked?: boolean
}
export interface Game {
  room: string
  players: Player[]
  psychic: string
  clues: Clue[]
  clue_selected?: number
  guesses?: Dict<Guess>
  target?: number
  match_number: number
  round_number: number
  phase: Phase
  team_turn: 1 | 2
  score_team_1: number
  score_team_2: number
  game_started_at: string
  game_finished_at?: string
  round_started_at?: string
}

export type CommandType =
  | 'change_player_team'
  | 'toggle_player_leader'
  | 'make_player_psychic'
  // Phases
  | 'begin_round'
  | 'select_clue'
  | 'confirm_clue'
  | 'set_guess'
  | 'lock_guess'
  | 'set_direction'
  | 'reveal'

export interface Command {
  text: string
  type?: CommandType
  disabled?: boolean
  rightText?: string
  value?: any
  rightValue?: any
  /** Percent width the right-side command should have */
  rightWidth?: number
}

export interface GameView extends Game {
  currentPlayer: Player
  cluesToShow: Clue[]
  playerGuesses: PlayerWithGuess[]
  averageGuess?: number
  canChangePsychicTo: 'any' | 'same_team' | 'none'
  commandInfo: string
  commandInfoColor?: string
  commands: Command[]
}
