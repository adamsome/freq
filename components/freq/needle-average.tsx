import { cx } from '../../lib/util/dom'
import IconSvg from '../control/icon-svg'

type Props = typeof defaultProps & {
  transform: string
}

const defaultProps = {}

export default function NeedleAverage({ transform }: Props) {
  return (
    <div
      className="absolute top-0 left-0 bottom-8 select-none transition-transform"
      style={{ transform }}
    >
      <div
        className={cx(`
          vertical-rl
          absolute top-0 left-[calc(50%-1px)] h-20 w-0.5
          bg-white text-right text-xs leading-[0.5rem]
          text-white/60 dark:bg-black dark:text-black/60
          sm:h-28
        `)}
      >
        <span className="relative left-2.5 cursor-default">AVERAGE</span>
      </div>
      <IconSvg
        name="caret-down"
        className="h-4 w-8 text-white dark:text-black"
      />
    </div>
  )
}

NeedleAverage.defaultProps = defaultProps
