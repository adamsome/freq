import colorDict from '../../lib/color-dict'
import { PlayerWithGuess } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'

type Props = typeof defaultProps & {
  player: PlayerWithGuess
}

const defaultProps = {
  size: 'md' as 'md' | 'lg',
}

const Needle = ({ player, size }: Props) => {
  const { color = 'Taupe', icon = '😃', locked } = player
  const hex = colorDict[color]?.hex
  const lg = size === 'lg'

  return (
    <div
      className={cx(`flex-center h-full select-none ${!lg ? 'w-6' : 'w-8'}`)}
    >
      <div
        className={cx(`
          select-none rounded bg-black shadow ring-1 ring-inset ring-black
          ${!lg ? 'h-24 w-1 sm:h-32' : 'h-28 w-1.5 sm:h-36'}
          ${!locked ? 'ring-opacity-10' : 'ring-opacity-30'}`)}
        style={{ background: hex }}
      ></div>
      <div
        className={cx(`
          flex-center absolute rounded-full
          bg-black text-white shadow
          ring-1 ring-inset ring-black dark:text-white
          ${!lg ? 'text-md bottom-2 h-6 w-6' : 'bottom-0 h-8 w-8 text-2xl'}
          ${!locked ? 'ring-opacity-10' : 'ring-opacity-30'}`)}
        style={{ background: hex }}
      >
        <span>{icon}</span>
      </div>
      <div
        className={cx(`
          absolute bottom-[1.875rem] bg-transparent
          ${size !== 'lg' ? 'h-0.5 w-0.5' : 'h-1 w-1'}`)}
        style={{ background: hex }}
      ></div>
    </div>
  )
}

Needle.defaultProps = defaultProps

export default Needle
