import { cx } from '../../lib/util/dom'
import { BlowCardProps } from './blow-card'

type Props = BlowCardProps & {
  className?: string
}

const DIAMOND_POLKA_DOTS_PATTERN_CLASSES = [
  'bg-[radial-gradient(var(--tw-gradient-from)_20%,transparent_0),radial-gradient(var(--tw-gradient-from)_20%,transparent_0)]',
  'bg-[length:6px_6px]',
  '[background-position:0_0,3px_3px]',
]

export default function BlowCardFacedownPattern({
  className = '',
  color = 'gray',
  size = 'sm',
}: Props) {
  const sm = size === 'xs' || size === 'sm'
  return (
    <div
      className={cx(className, {
        full: true,
        'p-px': true,
        border: true,
        'border-gray-300 dark:border-gray-700': color === 'gray',
        'border-cyan-500 dark:border-cyan-500': sm && color === 'cyan',
        'border-cyan-300 dark:border-cyan-900': !sm && color === 'cyan',
      })}
    >
      <div className="relative full">
        <div
          className={cx(DIAMOND_POLKA_DOTS_PATTERN_CLASSES, {
            'absolute full': true,
            'from-gray-300 dark:from-gray-700': color === 'gray',
            'from-cyan-500 dark:from-cyan-500': sm && color === 'cyan',
            'from-cyan-200 dark:from-cyan-925': !sm && color === 'cyan',
          })}
        ></div>
      </div>
    </div>
  )
}
