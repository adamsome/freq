import { PayloadAction } from '@reduxjs/toolkit'
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

const BLOW_ROLE_ACTION_IDS = [
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

export type BlowRoleActionID = typeof BLOW_ROLE_ACTION_IDS[number]

export interface BlowRoleActionDef {
  id: BlowRoleActionID
  name?: string
  label?: string | (string | BlowToken)[]
  description?: string | (string | BlowToken)[]
  payment?: number
  counter?: BlowRoleActionID
}

export const BLOW_ROLE_IDS = [
  'merchant',
  'thief',
  'killer',
  'guard',
  'explorer',
  'common',
] as const

export type BlowRoleID = typeof BLOW_ROLE_IDS[number]

export interface BlowRoleDef {
  id: BlowRoleID
  common?: boolean
  hasNoCounters?: boolean
  name: string
  actions: BlowRoleActionID[]
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
  id: BlowRoleActionID
  role?: BlowRoleID
  subject?: string
  target?: string
  token?: BlowToken[]
}

export type BlowActionState = 'normal' | 'active' | 'counter' | 'clickable'
export type BlowActionButtonColor = 'gray' | 'black' | 'cyan'

export type BlowCardVariant = 'empty' | 'facedown' | 'faceup'
export type BlowCardSize = 'xs' | 'sm' | 'md'
export type BlowCardColor = 'gray' | 'cyan'

export type BlowCoinSize = 'xs' | 'sm' | 'md'

export interface BlowGame extends BaseGame {
  settings: BlowSettings
  phase: BlowPhase
  player_order: number[]
  actions: PayloadAction<unknown>[]
  stats?: Dict<BlowPlayerStats>
}

export type BlowPlayerView = PlayerView & {
  /** References a card role or null to indicate an unknown facedown card */
  cards?: (BlowRoleID | null)[]
  coins?: number
}

export type BlowGameView = Omit<BlowGame, 'players'> & {
  type: GameType
  players: BlowPlayerView[]
  currentPlayer?: BlowPlayerView
  roles: readonly BlowRoleID[]
  commands: Command[]
  activePlayer?: string
  counterPlayer?: string
  actionState: Partial<Record<BlowRoleActionID, BlowActionState>>
}

// TODO: RoleSet's: Determine which roles included in game
// TODO: RoleTheme's: Overrides various role and action names, color, labels
