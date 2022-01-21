import { getBlowRoleAction } from '../../lib/blow/blow-role-action-defs'
import { BlowRoleActionID, BlowRoleID } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowRoleLabel from './blow-role-label'

type Props = {
  value: BlowRoleActionID | string
  role?: BlowRoleID
  className?: string
}

export default function BlowRoleActionLabel({
  value,
  role: rid,
  className: rawClassName,
}: Props) {
  const className = rawClassName ?? 'text-gray-500 dark:text-gray-400'
  const action = getBlowRoleAction(value)
  let label = action ? action.name : value
  let counter: string | undefined
  if (action?.counter) {
    const active = getBlowRoleAction(action.counter)
    label += ': '
    counter = active.name ?? ''
  }
  return (
    <>
      <BlowRoleLabel
        value={rid}
        // className={rawClassName}
        suffix=" → "
        hideIfCommon
      />

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
