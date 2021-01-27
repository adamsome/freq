import React from 'react'

export type IconSvgName = 'dropdown'

type Props = typeof defaultProps & {
  name: IconSvgName
}

const defaultProps = {
  color: 'subtle' as string,
  size: '1.25em' as string,
  top: '0' as string,
}

const IconSvg = ({ name, color, size, top }: Props) => {
  const fill = `var(--${color})`
  if (name === 'dropdown')
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        width={size}
        height={size}
        style={{ transform: 'rotate(360deg)', fill, position: 'relative', top }}
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path d="M7 10l5 5l5-5z" />
      </svg>
    )

  return null
}

IconSvg.defaultProps = defaultProps

export default IconSvg
