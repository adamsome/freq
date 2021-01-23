import { Player, PlayerGuess } from './player.types'

export interface Clue {
  left: string
  right: string
  gradient: string
}

const phases = [
  'prep',
  'choose',
  'guess',
  'direction',
  'reveal',
  'win',
] as const

export type Phase = typeof phases[number]

export interface Game {
  room: string
  players: Player[]
  psychic?: string
  clues: Clue[]
  clue_selected?: number
  guesses: Record<string, number>
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

export interface GameView extends Game {
  cluesToShow: Clue[]
  playerGuesses: PlayerGuess[]
}
