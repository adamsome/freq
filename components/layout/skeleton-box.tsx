import { cx } from '../../lib/util/dom'

type SkeletonBoxColor = 'gray' | 'cyan'

type Props = {
  className?: string
  innerClassName?: string
  color?: SkeletonBoxColor
  rounded?: boolean
}

const GRAY_COLORS = [
  'bg-gray-50',
  'from-gray-50 via-white to-gray-50',
  'dark:bg-gray-950',
  'dark:from-gray-950 dark:via-gray-900 dark:to-gray-950',
]

const CYAN_COLORS = [
  'bg-cyan-50',
  'from-cyan-50 via-white to-cyan-50',
  'dark:bg-cyan-975',
  'dark:from-cyan-975 dark:via-cyan-950 dark:to-cyan-975',
]

function getColorClasses(color: SkeletonBoxColor) {
  switch (color) {
    case 'cyan': {
      return CYAN_COLORS
    }
    default:
    case 'gray': {
      return GRAY_COLORS
    }
  }
}

export default function SkeletonBox({
  className = '',
  innerClassName = '',
  color = 'gray',
  rounded = true,
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
          getColorClasses(color),
          rounded && 'md:rounded-lg',
          innerClassName
        )}
      ></div>
    </div>
  )
}
