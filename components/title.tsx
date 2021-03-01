import React from 'react'
import { cx } from '../util/dom'
import { styleLinearGradientText } from '../util/dom-style'

type Props = typeof defaultProps & {
  animate?: boolean
}

const defaultProps = {
  title: 'Freq' as string,
}

const Title = ({ title, animate }: Props) => {
  return (
    <>
      <h1
        style={styleLinearGradientText('Freq')}
        className={cx('m-0 text-7xl font-extrabold text-center', {
          'animate-shift': animate,
          'hover:animate-shake': animate,
        })}
      >
        {title}
      </h1>
    </>
  )
}

Title.defaultProps = defaultProps

export default Title
