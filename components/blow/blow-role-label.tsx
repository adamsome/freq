import { getBlowRole } from '../../lib/blow/blow-role-defs'
import { BlowRoleID } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'

type Props = {
  children?: BlowRoleID | string
  value?: BlowRoleID | string
  className?: string
  suffix?: string
  hideIfCommon?: boolean
}

export default function BlowRoleLabel({
  children,
  value,
  className = 'text-gray-600 dark:text-gray-300',
  suffix,
  hideIfCommon,
}: Props) {
  const role = getBlowRole(children ?? value)
  if (hideIfCommon && role?.common) return null
  const label = role ? role.name : children ?? value
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
