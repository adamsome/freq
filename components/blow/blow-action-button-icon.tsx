import {
  BlowActionButtonColor,
  BlowRoleActionDef,
  BlowCardSize,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import IconSvg from '../control/icon-svg'
import BlowCoin from './tokens/blow-coin'

type Props = {
  action: BlowRoleActionDef
  counter?: BlowRoleActionDef
  color?: BlowActionButtonColor
  size?: BlowCardSize
  fetching?: boolean
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

function getColorClass(
  action: BlowRoleActionDef,
  color?: BlowActionButtonColor
) {
  switch (color) {
    case 'black': {
      return 'text-black dark:text-black'
    }
    case 'cyan':
      return !action.counter
        ? 'text-cyan-800 dark:text-cyan-400'
        : 'text-red-600 dark:text-red-400'
    case 'gray':
      return 'text-black dark:text-white'
  }
}

export default function BlowActionButtonIcon({
  action,
  counter,
  color = 'gray',
  size = 'sm',
  fetching,
}: Props) {
  const sm = size === 'xs' || size === 'sm'
  const md = size === 'md'
  const lg = size === 'lg' || size === 'xl'

  if (fetching) {
    if (!lg) return null
    return (
      <IconSvg name="spinner" className="w-3 h-3 ml-0.5 text-white" top="3px" />
    )
  }

  if (action.coins) {
    return (
      <BlowCoin
        className="mt-0.5"
        lit
        color={color as string}
        size={sm ? 'xs' : md ? 'sm' : 'md'}
        showIndividualCoins={false}
      >
        {action.coins}
      </BlowCoin>
    )
  }

  if (counter) {
    return (
      <IconSvg
        className={cx(
          'relative transition-all',
          sm
            ? 'w-0.5 h-0.5 ml-0'
            : md
            ? 'w-2.5 h-2.5 ml-0.5'
            : 'w-3 h-5 ml-0.5',
          getColorClass(action, color),
          getOpacityClass(color)
        )}
        top={sm ? '-0.5px' : md ? '3px' : '-1.5px'}
        name="shield"
      />
    )
  }

  return (
    <div
      className={cx(
        'transition-all',
        sm
          ? 'ml-0 leading-tight'
          : md
          ? 'ml-0.5 leading-normal'
          : 'ml-0.5 leading-tight',
        getColorClass(action, color),
        getOpacityClass(color)
      )}
    >
      →
    </div>
  )
}
