export interface Player {
  player_id: string
  name?: string
  team?: 1 | 2
  color?: string
  icon?: string
  leader?: boolean
}
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
  /** TODO: Rename to home_key */
  game_id: string
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
