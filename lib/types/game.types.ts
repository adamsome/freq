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
  designatedPsychic?: boolean
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

export const GAME_TYPES = ['freq', 'cwd', 'blow', 'res'] as const
export type GameType = typeof GAME_TYPES[number]

export interface BaseGame {
  /** Room code. */
  room: string
  /** List of players in the game. */
  players: Player[]
  match_number: number
  round_number: number
  /** Phase of the currently played match. */
  phase: CommonPhase
  /** Truth map of player IDs who have been kicked from the game. */
  kicked?: Dict<boolean>
  /** ISO Timestamp of when the room was initially created */
  room_started_at: string
  match_started_at?: string
  match_finished_at?: string
  round_started_at?: string
  round_finished_at?: string
  /**
   * UI helper -- never actually set on the server or DB, but the
   * client can set it in the frontend to indicate button loading states.
   **/
  fetching?: unknown
}
export interface TeamGuessGame extends BaseGame {
  /** Map of guess value & whether its locked, by player ID. */
  guesses?: Dict<Guess>
  /** Map of direcion guess value & whether its locked, by player ID. */
  directions?: Dict<Guess>
  /** Current team whose turn it is. */
  team_turn: 1 | 2
  /** Whether the team whose turn it is goes again after this round. */
  repeat_turn?: boolean
  score_team_1: number
  score_team_2: number
  /**
   * Keyed by the hash of current player IDs, lists all possible
   * combinations of team compositions. Each number is a binary representation
   * of a team composition where bit position represents a player (sorted
   * by player ID) and bit value (0 or 1) indicates the team.
   * Used by the `shuffle_team` command to get the next shuffled team
   * composition to prevent repeating already played compositions.
   */
  team_combos?: Dict<number[]>
  /**
   * Keyed by the hash of the current player IDs, stored the index of the last
   * used team combination from `team_combos`.
   */
  team_combos_index?: Dict<number>
}

export type CommandType =
  | 'change_player_team'
  | 'edit_player'
  | 'toggle_player_leader'
  | 'set_next_psychic'
  | 'set_current_psychic'
  | 'set_designated_psychic_mode'
  | 'set_difficulty'
  | 'set_theme'
  | 'kick_player'
  | 'shuffle_teams'
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
  // Custom per-game
  | 'action'

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
  /** Allows command to be processed even when the command is set to disabled.
   * Useful, e.g., when we want to allow a timer expired command to still be
   * processed when the command has been previously set to disabled on click.
   */
  allowExpiredWhenDisabled?: boolean
  color?: string
  colorLit?: number
  colorBorder?: number
  rightText?: string
  value?: unknown
  timer?: number
  rightType?: CommandType
  rightValue?: unknown
  rightTimer?: number
  /** Percent width the right-side command should have */
  rightWidth?: number
  rightColor?: string
  rightColorLit?: number
  rightColorBorder?: number
  rightDisabled?: boolean
  info?: string
  infoColor?: string
  fetching?: boolean
}

export interface CommandsView {
  headers?: Header[]
  commands: Command[]
}

export interface CommandError {
  command: Command
  data: unknown
  message: string
  date: Date
}

export interface BaseGameView extends Omit<BaseGame, 'players'>, CommandsView {
  type: GameType
  players: PlayerView[]
  currentPlayer?: PlayerView
}

export interface TeamGuessGameView
  extends Omit<TeamGuessGame, 'players'>,
    BaseGameView,
    CommandsView {
  canChangePsychicTo: CanChangePsychicTo
}

export interface ChangePermissions {
  psychic?: boolean
  nextPsychic?: boolean
  team?: boolean
}

export type ScoreType = 'points' | 'wins'

export type LanguageCode = 'en'
