import { tryGetBlowRole } from '../../lib/blow/blow-role-defs'
import { BlowRoleID } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'

type Props = {
  children?: BlowRoleID | string
  value?: BlowRoleID | string
  className?: string
}

export default function BlowRoleLabel({
  children,
  value,
  className = 'text-gray-500 dark:text-gray-400',
}: Props) {
  const role = tryGetBlowRole(children ?? value)
  const label = role ? role.name : children ?? value
  return (
    <span
      className={cx('font-spaced-narrow font-semibold -mr-[0.2em]', className)}
    >
      {label}
    </span>
  )
}
