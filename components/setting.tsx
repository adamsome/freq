import type { ReactNode } from 'react'
import { cx } from '../lib/util/dom'

type Props = typeof defaultProps & {
  children: ReactNode
  label: string
  onLabelClick?: () => void
}

const defaultProps = {}

const Setting = ({ children, label, onLabelClick }: Props) => {
  return (
    <div className="flex flex-col w-full items-start px-3 mb-4 first:mt-4">
      <label
        className={cx(
          'flex-1 ml-1.5 mb-0.5 text-black dark:text-white',
          'text-sm sm:text-base font-medium cursor-pointer'
        )}
        onClick={onLabelClick}
      >
        {label}
      </label>

      {children}
    </div>
  )
}

Setting.defaultProps = defaultProps

export default Setting
