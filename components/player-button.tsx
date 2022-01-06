import type { MouseEvent } from 'react'
import { shouldUsePlayerIcon } from '../lib/game'
import { User } from '../lib/types/user.types'
import { cx } from '../lib/util/dom'
import { styleColor } from '../lib/util/dom-style'
import useGame from '../lib/util/use-game'
import Button, { ButtonProps } from './control/button'
import IconSvg from './control/icon-svg'

type Props = {
  user?: User
  hero?: boolean
  button?: Partial<ButtonProps>
  onClick: (e: MouseEvent) => void
}

export default function PlayerButton({
  user,
  hero,
  button = {},
  onClick,
}: Props) {
  const { game } = useGame()
  const player = game?.currentPlayer

  return (
    <Button
      className={cx('flex text-center', {
        'text-xl pl-1 sm:pl-3 pr-0 sm:pr-2': !hero,
        'text-3xl': hero,
        'border border-gray-300 dark:border-gray-700': hero,
        'focus:border-blue-700 dark:focus:border-blue-700': hero,
        'pt-1.5 pr-0.5 pb-1 pl-3.5': hero,
      })}
      color={player?.team != null ? 'none' : 'blue'}
      style={styleColor(player)}
      onClick={onClick}
      {...button}
    >
      {shouldUsePlayerIcon(game?.type) && (
        <>{player?.icon ?? user?.icon ?? '🤠'}&nbsp;&nbsp;</>
      )}

      {player?.name ?? user?.name ?? 'Noname'}
      <div>
        <IconSvg
          name="dropdown"
          top={hero ? '0' : '1px'}
          className={cx('items-center', {
            'w-6 h-6': !hero,
            'w-8 h-8': hero,
          })}
        />
      </div>
    </Button>
  )
}
