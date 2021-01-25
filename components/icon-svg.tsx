import React from 'react'

export type IconSvgName = 'dropdown'

type Props = typeof defaultProps & {
  name: IconSvgName
}

const defaultProps = {}

const IconSvg = ({ name }: Props) => {
  if (name === 'dropdown')
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        width="1.25em"
        height="1.25em"
        style={{ transform: 'rotate(360deg)' }}
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path d="M7 10l5 5l5-5z" />

        <style jsx>{`
          path {
            fill: var(--subtle);
          }
        `}</style>
      </svg>
    )

  return null
}

IconSvg.defaultProps = defaultProps

export default IconSvg
