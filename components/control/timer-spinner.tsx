import { cx } from '../../lib/util/dom'
import {
  UseAnimatedTimerSpinnerProps,
  useTimerSpinnerAnimation,
} from '../../lib/util/use-animtated-timer-spinner'

type Props = UseAnimatedTimerSpinnerProps & {
  ariaLabel?: string
}

export default function TimerSpinner({
  ariaLabel = 'Timer spinner animation',
  ...props
}: Props) {
  const [elapsed, svgProps] = useTimerSpinnerAnimation(props)

  const time = Math.ceil(props.duration - elapsed)
  const { size, path, circumference } = svgProps
  const { stroke, strokeWidth, strokeDashoffset } = svgProps

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-label={ariaLabel}
    >
      <svg width={size} height={size}>
        <path
          className="stroke-black/10 dark:stroke-white/10"
          d={path}
          fill="none"
          strokeWidth={strokeWidth}
        />

        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeLinecap="square"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      <div
        aria-hidden="true"
        className={cx(`
          flex-center full absolute top-0 left-0
          font-sans text-[0.9375rem] font-semibold tracking-normal
          opacity-50
        `)}
        style={{ color: stroke }}
      >
        {time}
      </div>
    </div>
  )
}
