import { getBlowRoleAction } from '../../../lib/blow/blow-role-action-defs'
import { getBlowRole } from '../../../lib/blow/blow-role-defs'
import {
  BlowRoleActionID,
  BlowRoleID,
  BlowThemeID,
} from '../../../lib/types/blow.types'
import { cx } from '../../../lib/util/dom'
import getBlowRoleView from '../blow-role-card-view'
import BlowRoleIcon from '../icons/blow-role-icon'

type Props = {
  children?: BlowRoleID | string
  value?: BlowRoleID | string
  action?: BlowRoleActionID
  theme: BlowThemeID
  className?: string
  suffix?: string
  hideIfCommon?: boolean
}

export default function BlowRoleLabel({
  children,
  value,
  action,
  theme,
  className = 'text-gray-600 dark:text-gray-300',
  suffix,
  hideIfCommon,
}: Props) {
  const rid = (children ?? value) as BlowRoleID
  if (rid == null) return null
  const role = getBlowRole(theme, rid)
  if (hideIfCommon && role?.common) return null
  let label = role ? role.name : children ?? value

  if (theme === 'magic') {
    const view = getBlowRoleView(theme, rid, {
      clickable: true,
      useActionID: action,
    })
    if (rid === 'common' && action) {
      const x = getBlowRoleAction(theme, action)
      label = x.name
    }
    return (
      <div
        className={cx(
          'inline-flex items-baseline',
          'px-1 space-x-1',
          'border rounded',
          'pointer-events-none',
          view.classes.button
        )}
      >
        <BlowRoleIcon
          className={cx(view.classes.roleIcon, 'self-center w-4')}
          role={rid}
          action={action}
        />

        <span className={cx('font-narrow font-semibold', className)}>
          {label}
        </span>

        {suffix && <span className="text-xs">{suffix}</span>}
      </div>
    )
  }

  return (
    <>
      <span
        className={cx(
          'font-spaced-narrow font-semibold -mr-[0.2em]',
          className
        )}
      >
        {label}
      </span>

      {suffix && <span className="text-xs">{suffix}</span>}
    </>
  )
}
