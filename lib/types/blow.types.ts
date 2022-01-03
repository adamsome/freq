import { BaseGame, BaseGameView } from './game.types'
import { Dict } from './object.types'

export interface BlowPlayerStats {
  updated_at: string
  /** User ID */
  id: string
  /** Games played */
  g: number
  /** Wins */
  w: number
}

export const BLOW_PHASES = ['prep', 'guess', 'win'] as const

export type BlowPhase = typeof BLOW_PHASES[number]

export type BlowSettings = Record<string, never>

export interface BlowGame extends BaseGame {
  settings?: BlowSettings
  phase: BlowPhase
  player_order: string[]
  player_active: number
  stats?: Dict<BlowPlayerStats>
}

export type BlowGameView = Omit<BlowGame, 'players'> & BaseGameView
