import type { ReactNode } from 'react'
import invariant from 'tiny-invariant'
import {
  getBlowRoleAction,
  isBlowRoleActionDef,
} from '../../lib/blow/blow-role-action-defs'
import { isBlowRoleDef } from '../../lib/blow/blow-role-defs'
import {
  BlowActionState,
  BlowCardVariant,
  BlowPhase,
  BlowRoleActionID,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import SkeletonBox from '../layout/skeleton-box'
import BlowCardTitle from './blow-card-title'
import BlowRoleCardAction from './blow-role-card-action'
import BlowRoleCardButton from './blow-role-card-button'
import getBlowRoleView, { BlowRoleView } from './blow-role-card-view'
import BlowRoleIcon from './icons/blow-role-icon'

type Props = {
  index?: number
  actions?: Partial<Record<BlowRoleActionID, BlowActionState>>
  theme?: BlowThemeID
  phase?: BlowPhase
  variant?: BlowCardVariant
  disableOpacity?: boolean
  emptyMessage?: ReactNode
  fetching?: BlowRoleActionID | null
  onActionClick?: (id: BlowRoleActionID) => void
}

export default function BlowRoleCardCommon(props: Props) {
  const { theme, actions = {}, phase, index, disableOpacity } = props
  const view = getBlowRoleView(theme, 'common', actions, {
    clickable: phase === 'prep',
    useActionIndex: index,
    disableOpacity,
  })
  return (
    <BlowRoleCardButton {...props} view={view}>
      <BlowRoleCardContent {...props} view={view} />
    </BlowRoleCardButton>
  )
}

function BlowRoleCardContent(props: Props & { view: BlowRoleView }) {
  const {
    theme,
    actions = {},
    phase,
    index,
    variant,
    disableOpacity,
    emptyMessage,
  } = props

  if (variant === 'empty') {
    if (emptyMessage) return <>{emptyMessage}</>
    return null
  }

  if (!theme || index == null)
    return <SkeletonBox className="h-12 w-full" roundedClassName="rounded-md" />

  const { role, classes } = getBlowRoleView(theme, 'common', actions, {
    clickable: phase === 'prep',
    useActionIndex: index,
    disableOpacity,
  })
  invariant(isBlowRoleDef(role), `BlowRoleCardCommon: Role invalid`)

  const xid = role.actions[index]
  const action = getBlowRoleAction(theme, xid)
  invariant(isBlowRoleActionDef(action), `BlowRoleCardCommon: Action invalid`)

  return (
    <div className="flex w-full items-center justify-start">
      <BlowRoleIcon
        className={cx(classes.roleIcon, 'ml-1 mr-1 w-8 xs:ml-1.5 xs:mr-1.5')}
        role="common"
        action={xid}
      />

      <div className="relative flex-1 overflow-hidden pl-1">
        <BlowCardTitle
          className={cx(classes.title, 'mb-px')}
          {...props}
          theme={theme}
        >
          {action.name}
        </BlowCardTitle>

        {action ? (
          <BlowRoleCardAction
            action={action}
            theme={theme}
            classes={classes.active}
          />
        ) : (
          <div className={cx(classes.active.hint, 'text-sm italic')}>
            No Active Spell
          </div>
        )}
      </div>
    </div>
  )
}
