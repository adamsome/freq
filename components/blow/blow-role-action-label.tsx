import { getBlowRoleAction } from '../../lib/blow/blow-role-action-defs'
import {
  BlowRoleActionID,
  BlowRoleID,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowRoleLabel from './blow-role-label'

type Props = {
  className?: string
  value: BlowRoleActionID
  role?: BlowRoleID
  theme: BlowThemeID
}

export default function BlowRoleActionLabel({
  className: rawClassName,
  value,
  role: rid,
  theme,
}: Props) {
  const className = rawClassName ?? 'text-gray-500 dark:text-gray-400'
  const action = getBlowRoleAction(theme, value)
  let label = action.name
  let counter: string | undefined
  if (action?.counter) {
    const active = getBlowRoleAction(theme, action.counter)
    label += ': '
    counter = active.name ?? ''
  }
  return (
    <>
      <BlowRoleLabel value={rid} theme={theme} suffix=" → " hideIfCommon />

      <span
        className={cx('font-narrow', className, { 'font-semibold': !counter })}
      >
        {label}
      </span>

      {counter && (
        <span
          className={cx(
            'font-narrow font-semibold',
            'text-gray-500 dark:text-gray-400'
          )}
        >
          {counter}
        </span>
      )}
    </>
  )
}
