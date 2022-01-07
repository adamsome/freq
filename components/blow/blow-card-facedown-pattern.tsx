import { BlowCardColor } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'

type Props = {
  className?: string
  color?: BlowCardColor
}

export default function BlowCardFacedownPattern({
  className = '',
  color = 'gray',
}: Props) {
  return (
    <div
      className={cx(
        'full p-px border',
        {
          'border-gray-300 dark:border-gray-700': color === 'gray',
          'border-cyan-500 dark:border-cyan-500': color === 'cyan',
        },
        className
      )}
    >
      <div className="relative full">
        <div
          className={cx(
            'absolute full',
            {
              'from-gray-300 dark:from-gray-700': color === 'gray',
              'from-cyan-500 dark:from-cyan-500': color === 'cyan',
            },
            'bg-[radial-gradient(var(--tw-gradient-from)_20%,transparent_0),radial-gradient(var(--tw-gradient-from)_20%,transparent_0)]',
            'bg-[length:6px_6px]',
            '[background-position:0_0,3px_3px]'
          )}
        ></div>
      </div>
    </div>
  )
}
