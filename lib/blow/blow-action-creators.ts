import { createAction } from '@reduxjs/toolkit'
import {
  BlowAction,
  BlowActionID,
  BlowActionPayload,
  BlowCoreActionID,
  BlowRoleActionID,
  BLOW_CORE_ACTION_IDS,
  BLOW_ROLE_ACTION_IDS,
} from '../types/blow.types'
import { Command } from '../types/game.types'
import { isObject } from '../util/object'
import { isNotEmpty } from '../util/string'

// Role Actions

export const activateIncome = createAction<BlowActionPayload, BlowActionID>(
  'activate_income'
)

export const activateExtort = createAction<BlowActionPayload, BlowActionID>(
  'activate_extort'
)

export const counterExtort = createAction<BlowActionPayload, BlowActionID>(
  'counter_extort'
)

// Core Actions

export const challenge = createAction<BlowActionPayload, BlowActionID>(
  'challenge'
)

export const revealChallengeCard = createAction<
  BlowActionPayload,
  BlowActionID
>('reveal-challenge-card')

export const nextTurn = createAction<BlowActionPayload, BlowActionID>(
  'next-turn'
)

export const declineCounter = createAction<BlowActionPayload, BlowActionID>(
  'decline-counter'
)

export const continueTurn = createAction<BlowActionPayload, BlowActionID>(
  'continue-turn'
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

export const createCommand = (
  command: Partial<Command>,
  disabled?: boolean
): Command[] => {
  const cmd: Command = { type: 'action', text: '', ...command }
  if (disabled) cmd.disabled = true
  return [cmd]
}