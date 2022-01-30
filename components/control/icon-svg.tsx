import { cx } from '../../lib/util/dom'

export type IconSvgName =
  | 'dropdown'
  | 'caret-down'
  | 'spinner'
  | 'shield'
  | 'checkbox'
  | 'skull'

type Props = {
  className?: string
  name: IconSvgName
  top?: string
}

export default function IconSvg({ className = '', name, top = '0' }: Props) {
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

    case 'shield':
      return (
        <svg
          className={cx('relative fill-current', className)}
          aria-hidden="true"
          focusable="false"
          style={{ top }}
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-2.995 2.995-7.486 4-11 4 0 8.582 5.068 16.097 11 20 5.932-3.903 11-11.418 11-20-3.514 0-8.005-1.005-11-4zm-8.912 5.894c2.455-.246 5.912-1.012 8.912-3.25v18.906c-4-3.063-8.254-8.604-8.912-15.656z" />
        </svg>
      )

    case 'checkbox':
      return (
        <svg
          className={cx(
            'inline-block h-[1em] w-[1em] fill-current align-middle leading-none',
            top !== '0' && 'relative',
            className
          )}
          style={{ top: top !== '0' ? top : undefined }}
          viewBox="0 0 560 560"
          strokeMiterlimit="1.414"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m78.756 298.564l-40 69.282 242.488 140 240-415.692-69.282-40-200 346.41-173.206-100" />
        </svg>
      )

    case 'skull': {
      return (
        <svg
          className={cx('relative fill-current', className)}
          aria-hidden="true"
          focusable="false"
          style={{ top }}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 86.577 100"
        >
          <path d="M43.37,0C16.896,0-5.549,26.081,1.218,51.672c1.647,6.234,3.383,11.955,5.402,17.072  c-3.196,3.552-1.815,10.411,1.226,13.722c1.865,2.029,6.032,5.518,9.528,6.938c2.828-0.414,11.101-0.88,10.589,7.873  c0.959,0.39,1.963,0.728,2.998,1.034V94.85h1.247v3.802c1.676,0.427,3.429,0.758,5.256,0.979V94.85h1.243v4.903  C40.4,99.913,42.136,100,43.919,100c0.015,0,0.031,0,0.046,0v-5.152h1.245v5.128c1.774-0.038,3.514-0.146,5.188-0.349v-4.779h1.248  v4.6c1.739-0.257,3.409-0.608,4.999-1.062V94.85h1.245v3.151c0.715-0.236,1.411-0.485,2.086-0.765  c-1.391-10.938,9.662-9.106,11.232-8.793c3.615-1.213,8.2-5.032,10.183-7.188c3.163-3.438,4.545-10.73,0.835-14.137  c-0.125-0.115-0.27-0.195-0.401-0.307c1.378-4.01,2.595-8.402,3.726-13.186C91.63,27.862,69.843,0,43.37,0z M33.221,65.608  c-4.549,3.296-9.491,9.647-15.556,5.962c-6.067-3.685-6.207-17.21-2.647-22.577c3.057-4.613,20.582-3.497,22.839,0.374  C40.115,53.237,37.769,62.312,33.221,65.608z M49.393,81.858c-0.558,1.679-4.028-0.53-5.582-1.622  c-1.552,1.092-5.024,3.302-5.583,1.622c-0.724-2.175,3.802-15.734,4.347-16.829c0.162-0.326,0.405-0.605,0.664-0.808  c0.13-0.214,0.316-0.299,0.532-0.278c0.015-0.003,0.026,0.002,0.041,0c0.014,0.002,0.026-0.003,0.041,0  c0.216-0.021,0.402,0.065,0.533,0.279c0.26,0.201,0.502,0.48,0.661,0.807C45.589,66.123,50.118,79.684,49.393,81.858z   M70.974,70.491c-5.808,4.079-11.162-1.931-15.919-4.913c-4.76-2.982-7.702-11.885-5.704-15.898  c1.994-4.011,19.407-6.292,22.764-1.895C76.02,52.905,76.778,66.408,70.974,70.491z" />
        </svg>
      )
    }
    default:
      return null
  }
}
