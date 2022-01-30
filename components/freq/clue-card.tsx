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

  const maxWidthClass = 'max-w-[47.5%]'

  return (
    <div
      className={cx(`
        absolute top-0 bottom-0 left-4 right-4
        flex items-start justify-between overflow-hidden
        rounded-md border border-transparent
        bg-gray-100 bg-[length:125%] bg-center
        px-2 py-1
        font-bold text-black dark:bg-gray-900
        ${hasSlider ? 'bottom-8' : 'bottom-0'}
      `)}
      style={styleLinearGradient(clue.gradient)}
    >
      {children}

      <div className={cx(maxWidthClass, { 'text-white': lightLeft })}>
        <span>{clue.left}</span>
      </div>

      <div
        className={cx(maxWidthClass, 'text-right', {
          'text-white': lightRight,
        })}
      >
        <span>{clue.right}</span>
      </div>

      {label != null && (
        <div
          className={cx(`
            flex-center absolute top-0 bottom-0 left-0 right-0
            text-8xl text-black/20 dark:text-white/20
          `)}
        >
          <div>{label}</div>
        </div>
      )}
    </div>
  )
}

ClueCard.defaultProps = defaultProps

export default ClueCard
