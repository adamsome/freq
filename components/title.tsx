import React from 'react'
import { getGameTitle } from '../lib/game'
import { GameType } from '../types/game.types'
import { cx } from '../util/dom'
import { styleLinearGradientText } from '../util/dom-style'

type Props = typeof defaultProps & {
  type?: string | GameType | null
  title?: string
  animate?: boolean
}

const defaultProps = {
  classNames: '',
}

export default function Title({ classNames, type, title, animate }: Props) {
  return (
    <h1
      style={styleLinearGradientText(type ?? undefined)}
      className={cx('m-0 text-7xl font-extrabold text-center', classNames, {
        'animate-shift': animate,
        'hover:animate-shake': animate,
        'font-mono': type === 'cwd',
      })}
    >
      {title || (type ? getGameTitle(type) : <span>&nbsp;</span>)}
    </h1>
  )
}

Title.defaultProps = defaultProps
