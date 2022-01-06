import {
  BlowCardRole,
  BlowVariantDef,
  BlowVariantID,
} from '../types/blow.types'
import { BLOW_CARD_ROLE_DEFS } from './blow-roles'

export const BLOW_VARIANTS_DEFS: Record<BlowVariantID, BlowVariantDef> = {
  basic: { id: 'basic', name: 'Basic' },
}

const rs = BLOW_CARD_ROLE_DEFS // Alias
const BASIC_ROLES: BlowCardRole[] = [
  rs.merchant,
  rs.thief,
  rs.killer,
  rs.guard,
  rs.explorer,
  rs.common,
]

export function getBlowRoles(variantID: BlowVariantID): BlowCardRole[] {
  switch (variantID) {
    default:
    case 'basic': {
      return BASIC_ROLES
    }
  }
}
