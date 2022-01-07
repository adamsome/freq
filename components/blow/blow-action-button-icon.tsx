import {
  BlowActionButtonColor,
  BlowActionDef,
  BlowCardSize,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import IconSvg from '../control/icon-svg'
import BlowCoin from './blow-coin'

type Props = {
  action: BlowActionDef
  counter?: BlowActionDef
  color?: BlowActionButtonColor
  size?: BlowCardSize
}

function getOpacityClass(color?: BlowActionButtonColor) {
  return color === 'black'
    ? 'text-opacity-70 dark:text-opacity-70'
    : color === 'cyan'
    ? [
        'text-opacity-50 dark:text-opacity-50',
        'group-hover:text-opacity-70 dark:group-hover:text-opacity-70',
        'transition-opacity',
      ]
    : 'text-opacity-30 dark:text-opacity-30'
}

function getColorClass(color?: BlowActionButtonColor) {
  switch (color) {
    case 'black': {
      return 'text-black dark:text-black'
    }
    case 'cyan':
      return 'text-cyan-800 dark:text-cyan-400'
    case 'gray':
      return 'text-black dark:text-white'
  }
}

export default function BlowActionButtonIcon({
  action,
  counter,
  color = 'gray',
  size = 'sm',
}: Props) {
  const sm = size === 'xs' || size === 'sm'

  if (action.payment) {
    return (
      <BlowCoin
        className="mt-0.5"
        lit
        color={color}
        size={sm ? 'xs' : 'sm'}
        showIndividualCoins={false}
      >
        {action.payment}
      </BlowCoin>
    )
  }

  if (counter) {
    return (
      <IconSvg
        className={cx(
          'relative transition-all',
          sm ? 'w-0.5 h-0.5 ml-0' : 'w-3 h-5 ml-0.5',
          getColorClass(color),
          getOpacityClass(color)
        )}
        top={sm ? '-0.5px' : undefined}
        name="shield"
      />
    )
  }

  return (
    <div
      className={cx(
        'transition-all',
        sm ? 'ml-0 leading-tight' : 'ml-0.5',
        getColorClass(color),
        getOpacityClass(color)
      )}
    >
      →
    </div>
  )
}
