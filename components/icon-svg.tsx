import React from 'react'
import { cx } from '../util/dom'

export type IconSvgName = 'dropdown' | 'caret-down'

type Props = typeof defaultProps & {
  name: IconSvgName
}

const defaultProps = {
  size: '1.25em' as string | number,
  top: '0' as string,
  className: '',
}

const IconSvg = ({ className, name, size, top }: Props) => {
  const sizeStr = typeof size === 'number' ? `${size}px` : size

  if (name === 'dropdown')
    return (
      <svg
        className={cx('relative fill-current', className)}
        aria-hidden="true"
        focusable="false"
        width={sizeStr}
        height={sizeStr}
        style={{ transform: 'rotate(360deg)', top }}
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path d="M7 10l5 5l5-5z" />
      </svg>
    )

  if (name === 'caret-down')
    return (
      <svg
        className={cx('relative fill-current', className)}
        aria-hidden="true"
        focusable="false"
        width={sizeStr}
        height={`${Number(size) / 2}px`}
        style={{ transform: 'rotate(360deg)', top }}
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 10 5"
      >
        <path d="M0 0l5 5l5-5z" />
      </svg>
    )

  return null
}

IconSvg.defaultProps = defaultProps

export default IconSvg
