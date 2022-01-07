import { BaseGame, Command, GameType, PlayerView } from './game.types'
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

export interface BlowTokenCoin {
  type: 'coin'
  value: number
}

export interface BlowTokenCard {
  type: 'card'
  value: number
}

export type BlowToken = BlowTokenCoin | BlowTokenCard

const BLOW_ACTION_IDS = [
  'income',
  'extort',
  'blow',
  'activate_kill',
  'activate_raid',
  'counter_raid',
  'activate_trade',
  'counter_extort',
  'counter_kill',
  'activate_explore',
] as const

export type BlowActionID = typeof BLOW_ACTION_IDS[number]

export interface BlowActionDef {
  id: BlowActionID
  name?: string
  label?: string | (string | BlowToken)[]
  description?: string | (string | BlowToken)[]
  payment?: number
  counter?: BlowActionID
}

const BLOW_CARD_ROLE_IDS = [
  'merchant',
  'thief',
  'killer',
  'guard',
  'explorer',
  'common',
] as const

export type BlowCardRoleID = typeof BLOW_CARD_ROLE_IDS[number]

export interface BlowCardRole {
  id: BlowCardRoleID
  common?: boolean
  hasNoCounters?: boolean
  name: string
  actions: BlowActionID[]
  color?: string
}

const BLOW_VARIANT_IDS = ['basic'] as const

export type BlowVariantID = typeof BLOW_VARIANT_IDS[number]

export interface BlowVariantDef {
  id: BlowVariantID
  name: string
}

export interface BlowSettings {
  variant: BlowVariantID
}

export interface BlowAction {
  id: BlowActionID
  role?: BlowCardRoleID
  subject?: string
  target?: string
  token?: BlowToken[]
}

export type BlowActionState = 'normal' | 'active' | 'counter' | 'clickable'

export type BlowActionButtonColor = 'gray' | 'black' | 'cyan'

export interface BlowGame extends BaseGame {
  settings: BlowSettings
  phase: BlowPhase
  player_order: string[]
  actions: string[]
  stats?: Dict<BlowPlayerStats>
}

export type BlowPlayerView = PlayerView

export type BlowGameView = Omit<BlowGame, 'players'> & {
  type: GameType
  players: BlowPlayerView[]
  currentPlayer?: BlowPlayerView
  roles: BlowCardRole[]
  commands: Command[]
  activePlayer?: string
  counterPlayer?: string
  actionState: Partial<Record<BlowActionID, BlowActionState>>
}

// TODO: RoleSet's: Determine which roles included in game
// TODO: RoleTheme's: Overrides various role and action names, color, labels
