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

interface BlowTokenBase {
  className?: string
}
export interface BlowTokenText extends BlowTokenBase {
  type: 'text'
  value: string
}

export interface BlowTokenCoin extends BlowTokenBase {
  type: 'coin'
  value: number
  showIndividualCoins?: boolean
}

export interface BlowTokenCard extends BlowTokenBase {
  type: 'card'
  value: number
}

export interface BlowTokenPlayer extends BlowTokenBase {
  type: 'player'
  value: BlowPlayerView | string | number
}

export interface BlowTokenRole extends BlowTokenBase {
  type: 'role'
  value: BlowRoleID
  border?: boolean
}

export interface BlowTokenRoleAction extends BlowTokenBase {
  type: 'action'
  value: BlowRoleActionID
  role: BlowRoleID
  border?: boolean
}

export type BlowToken =
  | BlowTokenText
  | BlowTokenCoin
  | BlowTokenCard
  | BlowTokenPlayer
  | BlowTokenRole
  | BlowTokenRoleAction

export type BlowLabelDef = string | BlowToken | (string | BlowToken)[]

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
  'counter_raid_explore',
] as const

export type BlowRoleActionID = typeof BLOW_ROLE_ACTION_IDS[number]

export function isBlowRoleActionID(id: unknown): id is BlowRoleActionID {
  return (
    id != null &&
    typeof id === 'string' &&
    BLOW_ROLE_ACTION_IDS.includes(id as BlowRoleActionID)
  )
}

export type BlowTargetEffect = 'kill' | 'steal'

export interface BlowRoleActionDef {
  id: BlowRoleActionID
  name?: string
  label?: BlowLabelDef
  description?: BlowLabelDef
  coins?: number
  cards?: number
  counter?: BlowRoleActionID
  counterRole?: BlowRoleID
  counterLabel?: BlowLabelDef
  targetEffect?: BlowTargetEffect
  classes?: BlowRoleClasses
}

export const BLOW_CORE_ACTION_IDS = [
  'challenge',
  'reveal_card',
  'continue_turn',
  'decline_challenge',
  'decline_counter',
  'select_cards',
  'next_turn',
] as const

export type BlowCoreActionID = typeof BLOW_CORE_ACTION_IDS[number]

export type BlowTimerType = Exclude<
  BlowCoreActionID,
  'reveal_card' | 'select_cards'
>

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
  'killer',
  'thief',
  'guard',
  'explorer',
  'common',
] as const

export type BlowRoleID = typeof BLOW_ROLE_IDS[number]

export interface BlowRoleClasses {
  text?: string[]
  textAlpha?: string[]
  textAlphaHover?: string[]
  bg?: string[]
  bgAlpha?: string[]
  bgActive?: string[]
  bgAlphaHover?: string[]
  border?: string[]
  borderAlpha?: string[]
  borderAlphaHover?: string[]
  borderFocus?: string[]
  shadow?: string[]
  ring?: string[]
  ringMods?: string[]
}

export interface BlowRoleDef {
  id: BlowRoleID
  common?: boolean
  hasNoActive?: boolean
  hasNoCounters?: boolean
  name: string
  actions: BlowRoleActionID[]
  classes?: BlowRoleClasses
}

export type BlowRoleActionPair = [role: BlowRoleDef, action: BlowRoleActionDef]

const BLOW_VARIANT_IDS = ['basic'] as const

export type BlowVariantID = typeof BLOW_VARIANT_IDS[number]

const _BLOW_THEME_IDS = ['classic', 'magic', 'physical'] as const
// Blow 'classic' theme not currently supported
export const BLOW_THEME_IDS = _BLOW_THEME_IDS.slice(1)

export type BlowThemeID = typeof _BLOW_THEME_IDS[number]

export interface BlowVariantDef {
  id: BlowVariantID
  name: string
}

export interface BlowActionPayload {
  role?: BlowRoleID
  cardIndex?: number
  subject?: number
  target?: number
  token?: BlowToken[]
  expired?: boolean
}

export type BlowRoleAction = PayloadAction<BlowActionPayload, BlowRoleActionID>

export interface BlowAction extends PayloadAction<BlowActionPayload> {
  type: BlowActionID
  payload: BlowActionPayload
}

export interface BlowMessage {
  text: BlowLabelDef
  /** Index of the associated action */
  i: number
  line?: boolean
  error?: true
}

export type BlowActionState = 'normal' | 'active' | 'counter' | 'clickable'
export type BlowActionButtonColor =
  | 'gray'
  | 'black'
  | 'cyan'
  | 'body'
  | string
  | string[]

export type BlowCardVariant = 'empty' | 'facedown' | 'faceup'
export type BlowCardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type BlowCardColor = 'gray' | 'cyan'

export type BlowPlayerSeatSize = 'md' | 'lg'

export type BlowCoinSize = 'xs' | 'sm' | 'md' | 'lg'

export interface BlowSettings {
  /** Map timer type to the number of seconds in the countdown */
  timer: Record<BlowTimerType, number>
  variant: BlowVariantID
  theme: BlowThemeID
}

export interface BlowActionTurnInfo extends BlowAction {
  def: BlowRoleActionDef
  addedTargetMessage?: boolean
  addedMessage?: boolean
  hadChallengeOpportunity?: boolean
  hadCounterOpportunity?: boolean
  challengesDeclined?: number[]
  countersDeclined?: number[]
  countered?: boolean
  paid?: boolean
}

type ActionType = 'active' | 'counter'
type SubActionType = 'choose' | 'challenge'
export type BlowActionStep = `${ActionType}-${SubActionType}` | 'next'

export interface BlowTurnView {
  step: BlowActionStep
  role: BlowRoleID
  action: BlowRoleActionID
  targetable: boolean
  target?: number
  activeLabel: BlowLabelDef
  activeCmd: Command
  counterLabel: BlowLabelDef
  counters: BlowRoleID[]
  counterCmd: Command
  counterAction?: BlowRoleActionID
  counterRole?: BlowRoleID
  resolution?: BlowLabelDef
  nextCmd?: Command
}

export interface BlowPickTarget {
  action: BlowRoleAction
  description: BlowLabelDef
  targets: number[]
  target?: number
  fetching?: number
}

export interface BlowChallenge {
  challenger: number
  target: number
  role: BlowRoleID
  winner?: 'target' | 'challenger'
  cardIndex?: number
  challengerLoss?: true
  challengerCardIndex?: number
}

export type BlowCardSource = 'hand' | 'drawn'

export type BlowCardSelection = { type: BlowCardSource; index: number }

export interface BlowDrawCards {
  action: BlowActionTurnInfo
  drawnCards: (BlowRoleID | null)[]
  selected?: boolean
}

export interface BlowPickLossCard {
  action: BlowActionTurnInfo
  cardIndex?: number
}

export interface BlowGame extends BaseGame {
  settings: BlowSettings
  phase: BlowPhase
  player_order: number[]
  actions: PayloadAction<unknown>[]
  stats?: Dict<BlowPlayerStats>
}

export type BlowPlayerView = PlayerView & {
  index: number
  /** References a card role or null to indicate an unknown facedown card */
  cards: (BlowRoleID | null)[]
  cardsKilled: [boolean, boolean]
  /** Number of coins a player owns */
  coins: number
  /** Player index of player who can play a counter action */
  counter?: boolean
  eliminated?: boolean
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
  /** Index of player who can play the active action this turn */
  active?: number
  /** Index of player(s) who can play the counter action this turn */
  counter?: number[]
  turn?: BlowTurnView
  pickTarget?: BlowPickTarget
  challenge?: BlowChallenge
  drawCards?: BlowDrawCards
  pickLossCard?: BlowPickLossCard
  winner?: BlowPlayerView
}

// TODO: RoleSet's: Determine which roles included in game
// TODO: RoleTheme's: Overrides various role and action names, color, labels
