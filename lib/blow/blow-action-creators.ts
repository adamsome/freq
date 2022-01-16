import { createAction } from '@reduxjs/toolkit'
import {
  BlowAction,
  BlowActionID,
  BlowActionPayload,
  BlowCoreActionID,
  BlowRoleAction,
  BlowRoleActionID,
  BLOW_CORE_ACTION_IDS,
  BLOW_ROLE_ACTION_IDS,
} from '../types/blow.types'
import { Command } from '../types/game.types'
import { isObject } from '../util/object'
import { isNotEmpty } from '../util/string'

// Core Actions

export const challenge = createAction<BlowActionPayload, BlowActionID>(
  'challenge'
)

export const revealCard = createAction<BlowActionPayload, BlowActionID>(
  'reveal_card'
)

export const nextTurn = createAction<BlowActionPayload, BlowActionID>(
  'next_turn'
)

export const declineCounter = createAction<BlowActionPayload, BlowActionID>(
  'decline_counter'
)

export const continueTurn = createAction<BlowActionPayload, BlowActionID>(
  'continue_turn'
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

export const createCommand = (
  command: Partial<Command>,
  disabled?: boolean
): Command[] => {
  const cmd: Command = { type: 'action', text: '', ...command }
  if (disabled) cmd.disabled = true
  return [cmd]
}
