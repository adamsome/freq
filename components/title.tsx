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
        className={cx({
          'animate-shift': animate,
          'animate-shift-shake-hover': animate,
        })}
      >
        {title}
      </h1>

      <style jsx>{`
        h1 {
          margin: 0;
          line-height: 1.15;
          font-size: var(--font-size-xxl);
          font-weight: 800;
          text-align: center;
        }
      `}</style>
    </>
  )
}

Title.defaultProps = defaultProps

export default Title
