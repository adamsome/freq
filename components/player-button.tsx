import React from 'react'
import useGame from '../hooks/use-game'
import { User } from '../types/user.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import Button from './button'
import IconSvg from './icon-svg'

type Props = typeof defaultProps & {
  user?: User
  hero?: boolean
  onClick: (e: React.MouseEvent) => void
}

const defaultProps = {}

const PlayerButton = ({ user, hero, onClick }: Props) => {
  const { game } = useGame()
  const player = game?.currentPlayer

  return (
    <Button
      className={cx('flex pr-2 text-center', {
        'text-xl': !hero,
        'text-3xl': hero,
        'border border-gray-300 dark:border-gray-700': hero,
        'focus:border-blue-700 dark:focus:border-blue-700': hero,
        'pt-1.5 pr-0.5 pb-1 pl-3.5': hero,
      })}
      gray={player?.team != null}
      style={styleColor(player)}
      onClick={onClick}
    >
      {player?.icon ?? user?.icon ?? '🤠'}&nbsp;&nbsp;
      {player?.name ?? user?.name ?? 'Noname'}
      <div>
        <IconSvg name="dropdown" />
      </div>
    </Button>
  )
}

PlayerButton.defaultProps = defaultProps

export default PlayerButton
