import { cx } from '../../lib/util/dom'

type Props = typeof defaultProps

const defaultProps = {
  className: '',
  innerClassName: '',
  invert: false,
  rounded: true,
}

export default function SkeletonBox({
  className,
  innerClassName,
  invert,
  rounded,
}: Props) {
  return (
    <div className={className}>
      <div
        className={cx(
          'w-full h-full',
          'animate-shine bg-gradient-to-r bg-skeleton bg-no-repeat',
          'border-t border-b border-transparent',
          'md:border-l md:border-r',
          'focus:outline-none cursor-default',
          {
            'bg-gray-50 dark:bg-gray-950': !invert,
            'from-gray-50 via-white to-gray-50': !invert,
            'dark:from-gray-950 dark:via-gray-900 dark:to-gray-950': !invert,
            'bg-white dark:bg-gray-900': invert,
            'from-white via-gray-50 to-white': invert,
            'dark:from-gray-900 dark:via-gray-950 dark:to-gray-900': invert,
            'md:rounded-lg': rounded,
          },
          innerClassName
        )}
      ></div>
    </div>
  )
}

SkeletonBox.defaultProps = defaultProps
