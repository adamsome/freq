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
import { isObject } from '../util/object'
import { isNotEmpty } from '../util/string'

export const activateIncome = createAction<BlowActionPayload, BlowActionID>(
  'activate_income'
)

export const challenge = createAction<BlowActionPayload, BlowActionID>(
  'challenge'
)

export const nextTurn = createAction<BlowActionPayload, BlowActionID>(
  'next-turn'
)

export function isBlowAction(action: unknown): action is BlowAction {
  return (
    isObject(action) &&
    isNotEmpty(action.type) &&
    (BLOW_ROLE_ACTION_IDS.includes(action.type as BlowRoleActionID) ||
      BLOW_CORE_ACTION_IDS.includes(action.type as BlowCoreActionID))
  )
}
