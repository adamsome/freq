import { Guess } from './guess.types'
import { Dict } from './object.model'
import { Player, PlayerWithGuess } from './player.types'

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

export interface Game {
  room: string
  players: Player[]
  psychic: string
  clues: Clue[]
  clue_selected?: number
  guesses: Dict<Guess>
  match_number: number
  round_number: number
  phase: Phase
  team_turn: 1 | 2
  score_team_1: number
  score_team_2: number
  game_started_at: string
  game_finished_at?: string
  round_started_at: string
}

export interface Command {
  text: string
  waiting?: boolean
}

export interface GameView extends Game {
  currentPlayer: Player
  cluesToShow: Clue[]
  playerGuesses: PlayerWithGuess[]
  commandInfo: string
  commands: Command[]
}
