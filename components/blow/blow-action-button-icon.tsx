import {
  BlowActionButtonColor,
  BlowActionDef,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import IconSvg from '../control/icon-svg'
import BlowCoin from './blow-coin'

type Props = {
  action: BlowActionDef
  counter?: BlowActionDef
  color?: BlowActionButtonColor
}

export default function BlowActionButtonIcon({
  action,
  counter,
  color = 'gray',
}: Props) {
  const opacity =
    color === 'white'
      ? 'text-opacity-70 dark:text-opacity-70'
      : color === 'cyan'
      ? [
          'text-opacity-50 dark:text-opacity-50',
          'group-hover:text-opacity-70 dark:group-hover:text-opacity-70',
          'transition-opacity',
        ]
      : 'text-opacity-30 dark:text-opacity-30'

  if (action.payment) {
    return (
      <BlowCoin
        className="-top-px"
        lit
        color={color}
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
          'relative w-3 h-5 ml-0.5',
          color === 'cyan'
            ? 'text-cyan-800 dark:text-cyan-400'
            : 'text-black dark:text-white',
          opacity
        )}
        name="shield"
      />
    )
  }

  return (
    <div
      className={cx(
        'ml-0.5',
        color === 'cyan'
          ? 'text-cyan-800 dark:text-cyan-400'
          : 'text-black dark:text-white',
        opacity
      )}
    >
      →
    </div>
  )
}
