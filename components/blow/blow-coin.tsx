import type { HTMLAttributes } from 'react'
import { BlowActionButtonColor } from '../../lib/types/blow.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: number
  lit?: boolean
  color?: BlowActionButtonColor
  dimLabelWhenOne?: boolean
  showIndividualCoins?: boolean
}

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
          <BlowCoin key={i} color={color} {...props}>
            {1}
          </BlowCoin>
        ))}
      </div>
    )
  }

  const { className = '', ...divProps } = props

  const size = 'w-4 h-3.5'

  return (
    <div className={'relative inline-block ' + size}>
      <div
        className={cx(
          'absolute -left-0.5 w-5 h-5',
          'flex-center',
          '[background-image:radial-gradient(ellipse_at_center,var(--tw-gradient-from)_0%,var(--tw-gradient-from)_35%,rgb(0_0_0_/_0%)_65%,rgb(0_0_0_/_0%)_100%)]',
          getCoinColor(color, lit),
          className
        )}
        {...divProps}
      >
        <div
          className={cx(
            'absolute w-full text-center',
            'font-narrow font-extrabold',
            'text-center',
            getTextColor(color),
            dimLabelWhenOne && children === 1
              ? 'text-[0.7rem] text-opacity-20 dark:text-opacity-30'
              : 'text-[0.875rem] text-opacity-95 dark:text-opacity-95'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
