import { cx } from '../../lib/util/dom'
import IconSvg from '../control/icon-svg'

type Props = {
  transform: string
}

export default function NeedleAverage({ transform }: Props) {
  return (
    <div
      className="absolute bottom-8 left-0 top-0 select-none transition-transform"
      style={{ transform }}
    >
      <div
        className={cx(
          `vertical-rl absolute left-[calc(50%-1px)] top-0 h-20 w-0.5 bg-white text-right text-xs leading-[0.5rem] text-white/60 dark:bg-black dark:text-black/60 sm:h-28`
        )}
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
