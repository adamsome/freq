import { cx } from '../../lib/util/dom'

export type IconSvgName = 'dropdown' | 'caret-down' | 'spinner'

type Props = typeof defaultProps & {
  name: IconSvgName
}

const defaultProps = {
  top: '0' as string,
  className: '',
}

const IconSvg = ({ className, name, top }: Props) => {
  switch (name) {
    case 'dropdown':
      return (
        <svg
          className={cx('relative fill-current', className)}
          aria-hidden="true"
          focusable="false"
          style={{ transform: 'rotate(360deg)', top }}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5l5-5z" />
        </svg>
      )

    case 'caret-down':
      return (
        <svg
          className={cx('relative fill-current', className)}
          aria-hidden="true"
          focusable="false"
          style={{ transform: 'rotate(360deg)', top }}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 10 5"
        >
          <path d="M0 0l5 5l5-5z" />
        </svg>
      )

    case 'spinner':
      return (
        <svg
          className={cx('relative animate-spin', className)}
          focusable="false"
          style={{ top }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )

    default:
      return null
  }
}

IconSvg.defaultProps = defaultProps

export default IconSvg
