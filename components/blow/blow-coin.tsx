import type { HTMLAttributes } from 'react'
import { BlowActionButtonColor, BlowCoinSize } from '../../lib/types/blow.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: number
  size?: BlowCoinSize
  lit?: boolean
  color?: BlowActionButtonColor
  dimLabelWhenOne?: boolean
  showIndividualCoins?: boolean
}

export type BlowCoinProps = Props

const getCoinColor = (color: BlowActionButtonColor, lit = false) => {
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
  }
}

const getTextColor = (color: BlowActionButtonColor) => {
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
  }
}

export default function BlowCoin({
  children,
  size = 'md',
  lit,
  color = 'gray',
  dimLabelWhenOne = true,
  showIndividualCoins = true,
  ...props
}: Props) {
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
    <div className={'relative inline-block ' + sizeCx}>
      <div
        className={cx(
          'absolute flex-center',
          size === 'xs'
            ? '-top-0.5 left-0 w-0.5 h-0.5'
            : size === 'sm'
            ? '-top-px -left-0.5 w-4 h-4'
            : size === 'md'
            ? '-top-[3px] -left-0.5 w-5 h-5'
            : '-top-0.5 -left-0.5 w-7 h-7',
          'tracking-normal',
          '[background-image:radial-gradient(ellipse_at_center,var(--tw-gradient-from)_0%,var(--tw-gradient-from)_35%,rgb(0_0_0_/_0%)_65%,rgb(0_0_0_/_0%)_100%)]',
          getCoinColor(color, lit),
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
