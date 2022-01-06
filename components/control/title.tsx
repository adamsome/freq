import { getGameTitle } from '../../lib/game'
import { GameType } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { styleLinearGradientText } from '../../lib/util/dom-style'

type Props = typeof defaultProps & {
  type?: string | GameType | null
  title?: string
  animate?: boolean
  small?: boolean
  onClick?: () => void
}

const defaultProps = {
  classNames: '',
}

export default function Title({
  classNames,
  type,
  title,
  animate,
  small,
  onClick,
}: Props) {
  const label = title || (type ? getGameTitle(type) : <span>&nbsp;</span>)
  const styles = styleLinearGradientText(type ?? undefined)
  const classes = cx(classNames, {
    'animate-shift': animate,
    'hover:animate-shake': animate,
    'font-extrabold': type !== 'blow',
    'font-mono': type === 'cwd',
    'font-narrow font-light tracking-[0.2em] pl-3': type === 'blow',
    'cursor-pointer opacity-80 hover:opacity-100 transition-opacity':
      onClick != null,
  })

  if (small) {
    return (
      <div className={classes} style={styles} onClick={onClick}>
        {label}
      </div>
    )
  }

  return (
    <h1 style={styles} className={cx('m-0 text-7xl text-center', classes)}>
      {label}
    </h1>
  )
}

Title.defaultProps = defaultProps
