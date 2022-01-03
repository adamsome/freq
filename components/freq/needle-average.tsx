import { cx } from '../../lib/util/dom'
import IconSvg from '../control/icon-svg'

type Props = typeof defaultProps & {
  transform: string
}

const defaultProps = {}

export default function NeedleAverage({ transform }: Props) {
  return (
    <div
      className="absolute top-0 left-0 bottom-8 transition-transform select-none"
      style={{ transform }}
    >
      <div
        className={cx(
          'absolute top-0 left-[calc(50%-1px)] w-0.5 h-20 sm:h-28',
          'bg-white dark:bg-black',
          'text-white text-opacity-60 dark:text-black dark:text-opacity-60',
          'text-xs vertical-rl text-right leading-[0.5rem]',
          'vert'
        )}
      >
        <span className="relative left-2.5 cursor-default">AVERAGE</span>
      </div>
      <IconSvg
        name="caret-down"
        className="w-8 h-4 text-white dark:text-black"
      />
    </div>
  )
}

NeedleAverage.defaultProps = defaultProps
