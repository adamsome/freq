import { createAction, PayloadAction } from '@reduxjs/toolkit'
import {
  BlowAction,
  BlowActionID,
  BlowActionPayload,
  BlowCoreActionID,
  BlowCardSelection,
  BlowRoleAction,
  BlowRoleActionID,
  BLOW_CORE_ACTION_IDS,
  BLOW_ROLE_ACTION_IDS,
} from '../types/blow.types'
import { Command } from '../types/game.types'
import { isObject } from '../util/object'
import { isNotEmpty, isNotNil } from '../util/string'

// Core Actions

export const challenge = createAction<BlowActionPayload, BlowActionID>(
  'challenge'
)

export const revealCard = createAction<BlowActionPayload, BlowActionID>(
  'reveal_card'
)

export const continueTurn = createAction<BlowActionPayload, BlowActionID>(
  'continue_turn'
)

export const declineChallenge = createAction<BlowActionPayload, BlowActionID>(
  'decline_challenge'
)

export const declineCounter = createAction<BlowActionPayload, BlowActionID>(
  'decline_counter'
)

export const selectCards = createAction<BlowCardSelection[], BlowActionID>(
  'select_cards'
)

export const nextTurn = createAction<BlowActionPayload, BlowActionID>(
  'next_turn'
)

// Utilities

export function isBlowAction(action: unknown): action is BlowAction {
  return (
    isObject(action) &&
    isNotEmpty(action.type) &&
    (BLOW_ROLE_ACTION_IDS.includes(action.type as BlowRoleActionID) ||
      BLOW_CORE_ACTION_IDS.includes(action.type as BlowCoreActionID))
  )
}

export function isBlowRoleAction(action: unknown): action is BlowRoleAction {
  return (
    isObject(action) &&
    isNotEmpty(action.type) &&
    BLOW_ROLE_ACTION_IDS.includes(action.type as BlowRoleActionID)
  )
}

export function isActionWithBlowDrawSelectionPaylod(
  action: unknown
): action is PayloadAction<BlowCardSelection[]> {
  return (
    isObject(action) &&
    isNotNil(action.payload) &&
    Array.isArray(action.payload) &&
    // Selection needs at least one item
    isNotNil(action.payload?.[0]) &&
    isNotEmpty((action.payload[0] as BlowCardSelection).type) &&
    isNotNil((action.payload[0] as BlowCardSelection).index)
  )
}

export const createCommand = (
  command: Partial<Command>,
  disabled?: boolean
): Command => {
  const cmd: Command = { type: 'action', text: '', ...command }
  if (disabled) cmd.disabled = true
  return cmd
}
