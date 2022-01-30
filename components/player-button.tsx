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
      className={cx(
        'flex text-center',
        hero
          ? `border-gray-30 border
            pt-1.5 pr-0.5 pb-1 pl-3.5
            text-3xl
            focus:border-blue-700
            dark:border-gray-700
            dark:focus:border-blue-700`
          : `pl-1 pr-0 text-xl sm:pl-3 sm:pr-2`
      )}
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
          className={cx(`items-center ${!hero ? `h-6 w-6` : `h-8 w-8`}`)}
        />
      </div>
    </Button>
  )
}
