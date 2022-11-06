import { BaseGame, Command, GameType, PlayerView } from './game.types'

export const RES_PHASES = ['prep', 'guess', 'win'] as const
export type ResPhase = typeof RES_PHASES[number]

export type ResPlayerView = PlayerView

export type ResGame = BaseGame & {
  phase: ResPhase
  player_order: number[]
}

export type ResGameView = ResGame & {
  type: GameType
  commands: Command[]
}
