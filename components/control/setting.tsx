import type { ReactNode } from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  children: ReactNode
  label: string
  onLabelClick?: () => void
}

const Setting = ({ children, label, onLabelClick }: Props) => {
  return (
    <div className="mb-4 flex w-full flex-col items-start px-3 first:mt-4">
      <label
        className={cx(`
          mb-0.5 ml-1.5
          flex-1
          cursor-pointer
          text-sm font-medium
          text-black dark:text-white sm:text-base
        `)}
        onClick={onLabelClick}
      >
        {label}
      </label>

      {children}
    </div>
  )
}

export default Setting
