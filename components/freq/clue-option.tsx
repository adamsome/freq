import React from 'react'
import useGame from '../../hooks/use-game'
import { cx } from '../../util/dom'

type Props = typeof defaultProps & {
  children: React.ReactNode
  hasSlider: boolean
  selectable: boolean
  selecting: boolean
  selected: boolean
  notSelected: boolean
  onSelect: () => void
}

const defaultProps = {}

export default function ClueOption({
  children,
  hasSlider,
  selectable,
  selecting,
  selected,
  notSelected,
  onSelect: onClueSelect,
}: Props) {
  const { game } = useGame()
  if (!game) return null

  return (
    <div
      className={cx('w-full mb-4 sm:mb-5 transform transition-all', {
        'h-32 sm:h-40': hasSlider,
        'h-24 sm:h-32': !hasSlider,
        'scale-90': selectable,
        'scale-100': selected,
        'opacity-30': selectable && notSelected,
        'cursor-pointer hover:scale-100': selecting,
      })}
      onClick={onClueSelect}
    >
      {children}
    </div>
  )
}

ClueOption.defaultProps = defaultProps
