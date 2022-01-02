import { cx } from '../lib/util/dom'

type Props = typeof defaultProps & {
  big?: boolean
  color?: string
}

const defaultProps = {
  body: 'text-black dark:text-white',
  line: 'text-black dark:text-white',
  inner: 'text-white dark:text-black',
  invert: false,
}

export default function Logo({ color, body, line, inner, invert, big }: Props) {
  const _body = color ?? (invert ? inner : body)
  const _line = color ?? (invert ? inner : line)
  const _inner = color ? inner : invert ? body : inner
  const size = !big ? 40 : 64

  return (
    <svg width={size} height={size} viewBox="0 0 210 297">
      <path
        className={cx('fill-current stroke-current', _body)}
        strokeWidth="20"
        strokeMiterlimit="4"
        strokeDasharray="none"
        d="M 182.71107,203.76249 33.486632,203.05479 108.71174,74.176483 Z"
      />
      <path
        className={cx('stroke-current', _line)}
        strokeWidth="28"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="4"
        strokeDasharray="none"
        d="m 11.550336,148.28197 c 192.968534,0 192.968534,0 192.968534,0"
      />
      <path
        className={cx('fill-current', _inner)}
        strokeWidth="0"
        stroke="transparent"
        d="m 92.191598,135.93724 65.524152,-0.3619 15.15418,25.69509 H 76.914526 Z"
      />
    </svg>
  )
}

Logo.defaultProps = defaultProps
