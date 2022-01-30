import { HTMLAttributes, useState } from 'react'
import {
  BlowActionButtonColor,
  BlowCoinSize,
} from '../../../lib/types/blow.types'
import { range } from '../../../lib/util/array'
import { cx } from '../../../lib/util/dom'
import useUpdateEffect from '../../../lib/util/use-update-effect'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: number
  wrapperClassName?: string
  size?: BlowCoinSize
  lit?: boolean
  color?: BlowActionButtonColor
  animate?: boolean
  dimLabelWhenOne?: boolean
  showIndividualCoins?: boolean
}

export type BlowCoinProps = Props

const SHOCKWAVE_ANIMATION = [
  'animate-shockwave-jump',
  "after:content-['']",
  'after:absolute',
  'after:inset-0',
  'after:rounded-full',
  'after:animate-shockwave',
  "before:content-['']",
  'before:absolute',
  'before:inset-0',
  'before:rounded-full',
  'before:animate-shockwave-short',
]

const getCoinColor = (color: BlowActionButtonColor, lit = false): string => {
  switch (color) {
    case 'gray': {
      return lit
        ? 'from-slate-500 dark:from-slate-400'
        : 'from-slate-400 dark:from-slate-500'
    }
    case 'black': {
      return lit
        ? 'from-cyan-900 dark:from-cyan-900'
        : 'from-cyan-700 dark:from-cyan-800'
    }
    case 'cyan': {
      return lit
        ? 'from-cyan-700 dark:from-cyan-400'
        : 'from-cyan-600 dark:from-cyan-500'
    }
    case 'body': {
      return lit
        ? 'from-blue-400/70 dark:from-slate-200/50'
        : 'from-blue-300/70 dark:from-slate-300/40'
    }
    default: {
      return lit
        ? 'from-blue-100/70 dark:from-slate-800/90'
        : 'from-blue-100/70 dark:from-slate-800/60'
    }
  }
}

const getTextColor = (color: BlowActionButtonColor): string | string[] => {
  switch (color) {
    case 'gray': {
      return 'text-white dark:text-black'
    }
    case 'black': {
      return 'text-cyan-300 dark:text-cyan-400'
    }
    case 'cyan': {
      return 'text-cyan-100 dark:text-black'
    }
    case 'body': {
      return 'text-black dark:text-slate-900'
    }
    default: {
      return color
    }
  }
}

export default function BlowCoin({
  children,
  wrapperClassName,
  size = 'md',
  lit,
  color = 'gray',
  animate,
  dimLabelWhenOne = true,
  showIndividualCoins = true,
  ...props
}: Props) {
  const [doAnimate, setDoAnimate] = useState(false)

  useUpdateEffect(() => {
    setDoAnimate(true)

    const interval = setInterval(() => {
      setDoAnimate(false)
    }, 2000)

    return () => clearInterval(interval)
  }, [children])

  if (showIndividualCoins && children > 1) {
    return (
      <div className="inline-block">
        {range(0, children).map((i) => (
          <BlowCoin key={i} size={size} color={color} {...props}>
            {1}
          </BlowCoin>
        ))}
      </div>
    )
  }

  const { className = '', ...divProps } = props

  const sizeCx =
    size === 'xs'
      ? 'w-0.5 h-0.5'
      : size === 'sm'
      ? 'w-3 h-3'
      : size === 'md'
      ? 'w-4 h-3.5'
      : 'w-6 h-6'

  const dim = dimLabelWhenOne && children === 1

  return (
    <div className={cx('relative inline-block', sizeCx, wrapperClassName)}>
      <div
        className={cx(
          'flex-center absolute',
          size === 'xs'
            ? '-top-0.5 left-0 h-0.5 w-0.5'
            : size === 'sm'
            ? '-top-px -left-0.5 h-4 w-4'
            : size === 'md'
            ? '-top-[3px] -left-0.5 h-5 w-5'
            : '-top-0.5 -left-0.5 h-7 w-7',
          'tracking-normal',
          '[background-image:radial-gradient(ellipse_at_center,var(--tw-gradient-from)_0%,var(--tw-gradient-from)_35%,rgb(0_0_0_/_0%)_65%,rgb(0_0_0_/_0%)_100%)]',
          getCoinColor(color, lit),
          animate && doAnimate && SHOCKWAVE_ANIMATION,
          className
        )}
        {...divProps}
      >
        {size !== 'xs' && (
          <div
            className={cx(
              'absolute w-full text-center',
              'font-narrow font-extrabold',
              'text-center',
              getTextColor(color),
              dim
                ? 'text-opacity-20 dark:text-opacity-30'
                : 'text-opacity-95 dark:text-opacity-95',
              size === 'sm' || size === 'md'
                ? dim
                  ? 'text-[0.7rem]'
                  : 'text-[0.875rem]'
                : 'text-sm'
            )}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
