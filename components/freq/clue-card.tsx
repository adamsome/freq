import type { ReactNode } from 'react'
import { gradientLightTextDict } from '../../lib/gradient-dict'
import { FreqClue } from '../../lib/types/freq.types'
import { cx } from '../../lib/util/dom'
import { styleLinearGradient } from '../../lib/util/dom-style'

type Props = typeof defaultProps & {
  children: ReactNode
  clue: FreqClue
  label?: number
  hasSlider: boolean
}

const defaultProps = {}

const ClueCard = ({ children, clue, label, hasSlider }: Props) => {
  const [lightLeft, lightRight] = gradientLightTextDict[clue.gradient] ?? []

  return (
    <div
      className={cx(
        'absolute top-0 bottom-0 left-4 right-4 overflow-hidden',
        'flex justify-between items-start px-2 py-1',
        'bg-gray-100 dark:bg-gray-900 bg-125% bg-center',
        'text-black font-bold border border-transparent rounded-md',
        {
          'bottom-0': !hasSlider,
          'bottom-8': hasSlider,
        }
      )}
      style={styleLinearGradient(clue.gradient)}
    >
      {children}

      <div className={cx('max-w-19/40', { 'text-white': lightLeft })}>
        <span>{clue.left}</span>
      </div>

      <div
        className={cx('max-w-19/40 text-right', { 'text-white': lightRight })}
      >
        <span>{clue.right}</span>
      </div>

      {label != null && (
        <div
          className={cx(
            'absolute top-0 bottom-0 left-0 right-0 flex-center text-8xl',
            'text-black text-opacity-20 dark:text-white dark:text-opacity-20'
          )}
        >
          <div>{label}</div>
        </div>
      )}
    </div>
  )
}

ClueCard.defaultProps = defaultProps

export default ClueCard
