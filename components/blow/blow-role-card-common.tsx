import invariant from 'tiny-invariant'
import {
  getBlowRoleAction,
  isBlowRoleActionDef,
} from '../../lib/blow/blow-role-action-defs'
import { isBlowRoleDef } from '../../lib/blow/blow-role-defs'
import {
  BlowActionState,
  BlowPhase,
  BlowRoleActionID,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import SkeletonBox from '../layout/skeleton-box'
import BlowCardTitle from './blow-card-title'
import BlowRoleCardAction from './blow-role-card-action'
import BlowRoleCardButton from './blow-role-card-button'
import getBlowRoleView from './blow-role-card-view'
import BlowRoleIcon from './icons/blow-role-icon'

type Props = {
  index?: number
  actions?: Partial<Record<BlowRoleActionID, BlowActionState>>
  theme?: BlowThemeID
  phase?: BlowPhase
  fetching?: BlowRoleActionID | null
  onActionClick?: (id: BlowRoleActionID) => void
}

export default function BlowRoleCardCommon(props: Props) {
  return (
    <BlowRoleCardButton {...props}>
      <BlowRoleCardContent {...props} />
    </BlowRoleCardButton>
  )
}

function BlowRoleCardContent(props: Props) {
  const { theme, actions = {}, phase, index } = props

  if (!theme || index == null)
    return <SkeletonBox color="cyan" className="full" />

  const { role, classes } = getBlowRoleView(theme, 'common', actions, {
    clickable: phase === 'prep',
    useActionIndex: index,
  })
  invariant(isBlowRoleDef(role), `BlowRoleCardCommon: Role invalid`)

  const xid = role.actions[index]
  const action = getBlowRoleAction(theme, xid)
  invariant(isBlowRoleActionDef(action), `BlowRoleCardCommon: Action invalid`)

  return (
    <div className="flex justify-start items-center w-full">
      <BlowRoleIcon
        className={cx(classes.roleIcon, 'w-8')}
        role="common"
        action={xid}
      />

      <div className="relative flex-1 pl-1 overflow-hidden">
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
