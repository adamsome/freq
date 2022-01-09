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

export const BLOW_ROLE_ACTION_IDS = [
  'activate_income',
  'activate_extort',
  'activate_blow',
  'activate_kill',
  'activate_raid',
  'counter_raid',
  'activate_trade',
  'counter_extort',
  'counter_kill',
  'activate_explore',
] as const

export type BlowRoleActionID = typeof BLOW_ROLE_ACTION_IDS[number]

export function isBlowRoleActionID(id: unknown): id is BlowRoleActionID {
  return (
    id != null &&
    typeof id === 'string' &&
    BLOW_ROLE_ACTION_IDS.includes(id as BlowRoleActionID)
  )
}

export interface BlowRoleActionDef {
  id: BlowRoleActionID
  name?: string
  label?: string | (string | BlowToken)[]
  description?: string | (string | BlowToken)[]
  coins?: number
  counter?: BlowRoleActionID
}

export const BLOW_CORE_ACTION_IDS = ['challenge', 'next-turn'] as const

export type BlowCoreActionID = typeof BLOW_CORE_ACTION_IDS[number]

export function isBlowCoreActionID(id: unknown): id is BlowCoreActionID {
  return (
    id != null &&
    typeof id === 'string' &&
    BLOW_CORE_ACTION_IDS.includes(id as BlowCoreActionID)
  )
}

export type BlowActionID = BlowRoleActionID | BlowCoreActionID

export function isBlowActionID(id: unknown): id is BlowActionID {
  return isBlowCoreActionID(id) || isBlowRoleActionID(id)
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

export interface BlowActionPayload {
  role?: BlowRoleID
  subject?: string
  target?: string
  token?: BlowToken[]
}

export interface BlowAction extends PayloadAction<BlowActionPayload> {
  type: BlowActionID
  payload: BlowActionPayload
}

export interface BlowMessage {
  date: string
  text: string
  /** Number is player index; String is player ID or '__dealer' for dealer */
  subject?: string | number
  error?: true
}

export type BlowActionState = 'normal' | 'active' | 'counter' | 'clickable'
export type BlowActionButtonColor = 'gray' | 'black' | 'cyan'

export type BlowCardVariant = 'empty' | 'facedown' | 'faceup'
export type BlowCardSize = 'xs' | 'sm' | 'md'
export type BlowCardColor = 'gray' | 'cyan'

export type BlowCoinSize = 'xs' | 'sm' | 'md'

export type BlowTimerType = 'challenge' | 'next-turn'
export interface BlowTimer {
  type: BlowTimerType
  ends: string
}

export interface BlowSettings {
  variant: BlowVariantID
  /** Map timer type to the number of seconds in the countdown */
  timer: Record<BlowTimerType, number>
}

export interface BlowGame extends BaseGame {
  settings: BlowSettings
  phase: BlowPhase
  player_order: number[]
  actions: PayloadAction<unknown>[]
  stats?: Dict<BlowPlayerStats>
}

export type BlowPlayerView = PlayerView & {
  /** References a card role or null to indicate an unknown facedown card */
  cards: (BlowRoleID | null)[]
  /** Number of coins a player owns */
  coins: number
  /** Player index of player who can play a counter action */
  counter?: boolean
}

export type BlowGameView = Omit<BlowGame, 'players'> & {
  type: GameType
  players: BlowPlayerView[]
  currentPlayer?: BlowPlayerView
  /** Role IDs being used in this match */
  roles: readonly BlowRoleID[]
  /** List of command buttons, i.e. Deal Cards or Challenge */
  commands: Command[]
  messages: BlowMessage[]
  /** Map of role action to its state (active, clickable, counter, normal) */
  actionState: Partial<Record<BlowRoleActionID, BlowActionState>>
  timer?: BlowTimer
}

// TODO: RoleSet's: Determine which roles included in game
// TODO: RoleTheme's: Overrides various role and action names, color, labels
