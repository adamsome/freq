import {
  BlowActionID,
  BlowActionState,
  BlowCardRole,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import SkeletonBox from '../layout/skeleton-box'
import BlowActionButton from './blow-action-button'
import BlowRoleCardOutline from './blow-role-card-outline'

type Props = {
  role?: BlowCardRole
  actions?: Partial<Record<BlowActionID, BlowActionState>>
}

export default function BlowRoleCard({ role, actions = {} }: Props) {
  if (!role)
    return (
      <BlowRoleCardOutline>
        <SkeletonBox color="cyan" className="w-full h-full" />
      </BlowRoleCardOutline>
    )

  return (
    <BlowRoleCardOutline>
      <div
        className={cx(
          'flex flex-col',
          'select-none',
          'w-full h-full px-1.5 pt-0.5 pb-1.5',
          'bg-cyan-100 dark:bg-cyan-975',
          'rounded-sm'
        )}
      >
        {!role.common && <div className="font-semibold">{role.name}</div>}

        <div className="flex-1"></div>

        <div className="space-y-1.5">
          {role.actions.map((a) => (
            <BlowActionButton
              key={a}
              className="flex-1"
              id={a}
              state={actions[a]}
            />
          ))}

          {!role.common && role.actions.length < 2 && role.hasNoCounters && (
            <div className="min-h-[var(--blow-action-button-min-height)]"></div>
          )}
        </div>
      </div>
    </BlowRoleCardOutline>
  )
}
