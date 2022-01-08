import {
  BlowRoleID,
  BlowVariantDef,
  BlowVariantID,
  BLOW_ROLE_IDS,
} from '../types/blow.types'

export const BLOW_VARIANTS_DEFS: Record<BlowVariantID, BlowVariantDef> = {
  basic: { id: 'basic', name: 'Basic' },
}

const BASIC_ROLES: readonly BlowRoleID[] = BLOW_ROLE_IDS

export function getBlowRoles(variantID: BlowVariantID): readonly BlowRoleID[] {
  switch (variantID) {
    default:
    case 'basic': {
      return BASIC_ROLES
    }
  }
}
