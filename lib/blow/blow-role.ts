import { BlowRoleID, BlowVariantID, BLOW_ROLE_IDS } from '../types/blow.types'

const BASIC_ROLES: readonly BlowRoleID[] = BLOW_ROLE_IDS

export function getBlowRoles(variantID: BlowVariantID): readonly BlowRoleID[] {
  switch (variantID) {
    default:
    case 'basic': {
      return BASIC_ROLES
    }
  }
}
