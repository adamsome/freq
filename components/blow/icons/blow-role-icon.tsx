import React from 'react'
import { BlowRoleActionID, BlowRoleID } from '../../../lib/types/blow.types'
import BlowRoleIconAbjuration from './blow-role-icon-abjuration'
import BlowRoleIconConjuration from './blow-role-icon-conjuration'
import BlowRoleIconDivination from './blow-role-icon-divination'
import BlowRoleIconEvocation from './blow-role-icon-evocation'
import BlowRoleIconIllusion from './blow-role-icon-illusion'
import BlowRoleIconNecromancy from './blow-role-icon-necromancy'
import BlowRoleIconPotion from './blow-role-icon-potion'
import BlowRoleIconSvefnthorn from './blow-role-icon-svefnthorn'
import BlowRoleIconTransmutation from './blow-role-icon-transmutation'

type Props = {
  className?: string
  role: BlowRoleID
  action?: BlowRoleActionID
}

export default function BlowRoleIcon(props: Props) {
  const { role, action, ...rest } = props
  switch (role) {
    case 'killer': {
      return <BlowRoleIconEvocation {...rest} />
    }
    case 'thief': {
      return <BlowRoleIconNecromancy {...rest} />
    }
    case 'merchant': {
      return <BlowRoleIconTransmutation {...rest} />
    }
    case 'guard': {
      return <BlowRoleIconAbjuration {...rest} />
    }
    case 'explorer': {
      return <BlowRoleIconConjuration {...rest} />
    }
    case 'common': {
      switch (action) {
        case 'activate_income': {
          return <BlowRoleIconSvefnthorn {...rest} />
        }
        case 'activate_extort': {
          return <BlowRoleIconPotion {...rest} />
        }
        case 'activate_blow': {
          return <BlowRoleIconIllusion {...rest} />
        }
      }
    }
    default: {
      return <BlowRoleIconDivination {...rest} />
    }
  }
}
