import { Guess } from './guess.types'

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
