import { Dict } from './object.types'

export interface Player {
  id: string
  name?: string
  team?: 1 | 2
  color?: string
  icon?: string
  leader?: boolean
  fetching?: boolean
}

export interface PlayerView extends Player {
  current?: boolean
  active?: boolean
  psychic?: boolean
  nextPsychic?: boolean
  showPsychic?: boolean
  showNextPsychic?: boolean
  canSetPsychic?: boolean
  canSetNextPsychic?: boolean
  canChangeTeam?: boolean
  points?: number
  wins?: number
}

export interface Guess {
  value: number
  locked?: boolean
}

export type PlayerWithGuess = Player & Guess

export const COMMON_PHASES = [
  'prep',
  'choose',
  'guess',
  'direction',
  'reveal',
  'win',
] as const

export type CommonPhase = typeof COMMON_PHASES[number]

const GameType = ['freq', 'cwd'] as const
export type GameType = typeof GameType[number]
export interface CommonGame {
  room: string
  players: Player[]
  guesses?: Dict<Guess>
  directions?: Dict<Guess>
  match_number: number
  round_number: number
  team_turn: 1 | 2
  repeat_turn?: boolean
  phase: CommonPhase
  score_team_1: number
  score_team_2: number
  kicked?: Dict<boolean>
  room_started_at: string
  match_started_at?: string
  match_finished_at?: string
  round_started_at?: string
  round_finished_at?: string
}

export type CommandType =
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

export type CanChangePsychicTo = 'any' | 'same_team' | 'none'

export interface Header {
  text: string
  color?: string
  colorLit?: number
}

export interface Command {
  text: string
  type?: CommandType
  disabled?: boolean
  color?: string
  rightText?: string
  value?: any
  rightType?: CommandType
  rightValue?: any
  /** Percent width the right-side command should have */
  rightWidth?: number
  rightColor?: string
  rightDisabled?: boolean
  info?: string
  infoColor?: string
  fetching?: boolean
}

export interface CommandsView {
  headers: Header[]
  commands: Command[]
}

export interface CommonGameView extends CommonGame, CommandsView {
  type: GameType
  currentPlayer?: PlayerView
  players: PlayerView[]
  canChangePsychicTo: CanChangePsychicTo
}

export interface ChangePermissions {
  psychic?: boolean
  nextPsychic?: boolean
  team?: boolean
}

export type ScoreType = 'points' | 'wins'

export type LanguageCode = 'en'
