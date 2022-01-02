import colorDict from '../../lib/color-dict'
import { PlayerWithGuess } from '../../types/game.types'
import { cx } from '../../util/dom'

type Props = typeof defaultProps & {
  player: PlayerWithGuess
}

const defaultProps = {
  size: 'md' as 'md' | 'lg',
}

const Needle = ({ player, size }: Props) => {
  const { color = 'yellow', icon = '😃', locked } = player
  const hex = colorDict[color]?.hex

  return (
    <div
      className={cx('h-full flex-center select-none', {
        'w-6': size !== 'lg',
        'w-8': size === 'lg',
      })}
    >
      <div
        className={cx(
          'bg-black rounded select-none',
          'ring-1 ring-inset ring-black shadow',
          {
            'w-1 h-24 sm:h-32': size !== 'lg',
            'w-1.5 h-28 sm:h-36': size === 'lg',
            'ring-opacity-10 shadow': !locked,
            'ring-opacity-30 shadow': locked,
          }
        )}
        style={{ background: hex }}
      ></div>
      <div
        className={cx(
          'absolute flex-center rounded-full',
          'bg-black text-white dark:text-white',
          'ring-1 ring-inset ring-black shadow',
          {
            'bottom-2 w-6 h-6 text-md': size !== 'lg',
            'bottom-0 w-8 h-8 text-2xl': size === 'lg',
            'ring-opacity-10 shadow': !locked,
            'ring-opacity-30 shadow': locked,
          }
        )}
        style={{ background: hex }}
      >
        <span>{icon}</span>
      </div>
      <div
        className={cx('absolute bottom-7.5 bg-transparent', {
          'h-0.5 w-0.5': size !== 'lg',
          'h-1 w-1': size === 'lg',
        })}
        style={{ background: hex }}
      ></div>
    </div>
  )
}

Needle.defaultProps = defaultProps

export default Needle
