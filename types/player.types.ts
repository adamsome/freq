export interface Player {
  player_id: string
  name?: string
  team?: 1 | 2
  color?: string
  icon?: string
  leader?: boolean
}

export interface PlayerGuess extends Player {
  guess: number
}
