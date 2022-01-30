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
  border?: boolean
  hideIfCommon?: boolean
}

export default function BlowRoleLabel({
  children,
  value,
  action,
  theme,
  className,
  suffix,
  border = true,
  hideIfCommon,
}: Props) {
  const rid = (children ?? value) as BlowRoleID
  if (rid == null) return null
  const role = getBlowRole(theme, rid)
  if (hideIfCommon && role?.common) return null
  let label = role ? role.name : children ?? value

  if (theme !== 'classic') {
    const view = getBlowRoleView(theme, rid, {
      clickable: true,
      useActionID: action,
    })
    if (rid === 'common' && action) {
      const x = getBlowRoleAction(theme, action)
      label = x.name
    }
    let iconSizeClassName = 'w-4'
    if ((className ?? '').includes('text-xs')) iconSizeClassName = 'w-3.5'
    return (
      <div
        className={cx(border && view.classes.button, {
          'pointer-events-none inline-flex items-baseline space-x-1': true,
          'rounded border px-1': border,
        })}
      >
        <BlowRoleIcon
          className={cx(
            view.classes.roleIcon,
            iconSizeClassName,
            'self-center'
          )}
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
          'font-spaced-narrow -mr-[0.2em] font-semibold',
          className ?? 'text-gray-600 dark:text-gray-300'
        )}
      >
        {label}
      </span>

      {suffix && <span className="text-xs">{suffix}</span>}
    </>
  )
}
