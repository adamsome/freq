import type { ButtonHTMLAttributes } from 'react'
import { Player } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import { styleColor } from '../lib/util/dom-style'
import Button from './control/button'

type Props = typeof defaultProps &
  ButtonHTMLAttributes<unknown> & {
    player?: Player | null
  }

const defaultProps = {
  className: '',
  close: false,
  leave: false,
  noDivider: false,
}

export default function PlayerOptionButton({
  children,
  player,
  className,
  close,
  leave,
  noDivider,
  disabled,
  ...props
}: Props) {
  return (
    <Button
      className={cx(
        'w-full px-4 py-3 rounded-none text-left',
        {
          'border-l-0 border-r-0 border-t-0 last:border-b-0': !noDivider,
          'border-gray-300 dark:border-gray-700': !noDivider,
          'focus:border-l-0 focus:border-r-0': !noDivider,
          'text-black dark:text-white': !leave,
          'hover:bg-gray-100 dark:hover:bg-gray-800': !close,
          'bg-gray-200 dark:bg-gray-700': close,
          'hover:bg-gray-300 dark:hover:bg-gray-600': close,
        },
        className ?? ''
      )}
      blue={false}
      red={leave}
      round={false}
      ring={false}
      disabled={disabled}
      style={styleColor(player)}
      {...props}
    >
      {children}
    </Button>
  )
}

PlayerOptionButton.defaultProps = defaultProps
