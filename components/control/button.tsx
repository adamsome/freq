/*! ant-design v4.12.3 | MIT License | https://github.com/ant-design/ant-design/blob/master/components/button/button.tsx */
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  ReactNode,
} from 'react'
import { cx } from '../../lib/util/dom'
import { omit } from '../../lib/util/object'

export type ButtonColor = 'blue' | 'cyan' | 'red' | 'gray' | 'none'
export type ButtonVariant = 'link' | 'dim' | 'solid'

interface ButtonColorOptions {
  color?: ButtonColor
  variant?: ButtonVariant | false
  border?: boolean
  bgHover?: boolean
}

const ButtonHTMLTypes = ['submit', 'button', 'reset'] as const
export type ButtonHTMLType = typeof ButtonHTMLTypes[number]

type BaseProps = ButtonColorOptions & {
  children: ReactNode
  className?: string
  spacing?: string
  round?: boolean
  ring?: boolean
  selectable?: boolean
}

type AnchorHtmlProps = {
  href: string
  target?: string
  onClick?: MouseEventHandler<HTMLElement>
} & BaseProps &
  Omit<AnchorHTMLAttributes<unknown>, 'color' | 'type' | 'onClick'>

type ButtonHtmlProps = {
  htmlType?: ButtonHTMLType
  onClick?: MouseEventHandler<HTMLElement>
} & BaseProps &
  Omit<ButtonHTMLAttributes<unknown>, 'color' | 'type' | 'onClick'>

export type ButtonProps = Partial<AnchorHtmlProps & ButtonHtmlProps>

const DEFAULT_RING =
  'focus:ring-4 focus:ring-opacity-25 dark:focus:ring-opacity-25'

export default function Button({
  className = '',
  spacing = 'm-0 px-3 py-0',
  children,
  color = 'blue',
  variant: _variant,
  border,
  bgHover = true,
  round = true,
  ring = true,
  selectable,
  htmlType = 'button' as ButtonProps['htmlType'],
  ...props
}: ButtonProps) {
  const handleClick = (
    e: ReactMouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
  ) => {
    const { onClick } = props
    const _onClick = onClick as MouseEventHandler<
      HTMLButtonElement | HTMLAnchorElement
    >
    _onClick?.(e)
  }

  const variant = typeof _variant === 'string' ? _variant : 'link'

  const getColorClasses = (): string[] | undefined => {
    const classes: string[] = []

    switch (color) {
      case 'blue': {
        switch (variant) {
          case 'solid': {
            classes.push('text-white')
            classes.push('bg-blue-700')

            if (bgHover) {
              classes.push('hover:bg-blue-900 dark:hover:bg-blue-600')
            }
            if (border) {
              classes.push('border-blue-900 dark:border-blue-500')
            }

            return classes
          }
          case 'dim': {
            classes.push('text-blue-600')
            classes.push('disabled:text-blue-600 disabled:dark:text-blue-600')
            classes.push('hover:text-blue-800 dark:hover:text-blue-400')
            classes.push('bg-blue-100 dark:bg-blue-950')

            if (bgHover) {
              classes.push('hover:bg-blue-200 dark:hover:bg-blue-900')
            }
            if (border) {
              classes.push('border-blue-200 dark:border-blue-900')
            }

            return classes
          }
          default:
          case 'link': {
            classes.push('text-blue-600 dark:text-blue-700')
            classes.push('disabled:text-blue-600 disabled:dark:text-blue-700')
            classes.push('hover:text-blue-800 dark:hover:text-blue-600')

            if (bgHover) {
              classes.push('hover:bg-blue-100 dark:hover:bg-blue-950')
            }
            if (border) {
              classes.push('border-blue-400 dark:border-blue-500')
            }

            return classes
          }
        }
      }
      case 'cyan': {
        switch (variant) {
          case 'solid': {
            classes.push('text-white')
            classes.push('bg-cyan-700')

            if (bgHover) {
              classes.push('hover:bg-cyan-900 dark:hover:bg-cyan-600')
            }
            if (border) {
              classes.push('border-cyan-900 dark:border-cyan-500')
            }

            return classes
          }
          case 'dim': {
            classes.push('text-cyan-600 dark:text-cyan-400')
            classes.push('disabled:text-cyan-600 disabled:dark:text-cyan-400')
            classes.push('hover:text-cyan-800 dark:hover:text-cyan-300')
            classes.push('bg-cyan-100 dark:bg-cyan-975')

            if (bgHover) {
              classes.push('hover:bg-cyan-200 dark:hover:bg-cyan-900')
            }
            if (border) {
              classes.push('border-cyan-200 dark:border-cyan-900')
            }

            return classes
          }
          default:
          case 'link': {
            classes.push('text-cyan-600 dark:text-cyan-600')
            classes.push('disabled:text-cyan-600 disabled:dark:text-cyan-600')
            classes.push('hover:text-cyan-800 dark:hover:text-cyan-500')

            if (bgHover) {
              classes.push('hover:bg-cyan-100 dark:hover:bg-cyan-950')
            }
            if (border) {
              classes.push('border-cyan-400 dark:border-cyan-500')
            }

            return classes
          }
        }
      }
      case 'red': {
        if (border) {
          classes.push('focus:border-red-700 dark:focus:border-red-700')
        }

        switch (variant) {
          case 'solid': {
            classes.push('text-white')
            classes.push('bg-red-700')

            if (bgHover) {
              classes.push('hover:bg-red-900 dark:hover:bg-red-600')
            }
            if (border) {
              classes.push('border-red-900 dark:border-red-500')
            }

            return classes
          }
          case 'dim': {
            classes.push('text-red-700 dark:text-red-800')
            classes.push('disabled:text-red-700 disabled:dark:text-red-800')
            classes.push('hover:text-red-900 dark:hover:text-red-500')
            classes.push('bg-red-100 dark:bg-red-950')

            if (bgHover) {
              classes.push('hover:bg-red-200 dark:hover:bg-red-900')
            }
            if (border) {
              classes.push('border-red-200 dark:border-red-900')
            }

            return classes
          }
          default:
          case 'link': {
            classes.push('text-red-700 dark:text-red-800')
            classes.push('disabled:text-red-700 disabled:dark:text-red-800')
            classes.push('hover:text-red-900 dark:hover:text-red-700')

            if (bgHover) {
              classes.push('hover:bg-red-100 dark:hover:bg-red-950')
            }
            if (border) {
              classes.push('border-red-400 dark:border-red-500')
            }

            return classes
          }
        }
      }
      case 'gray': {
        if (border) {
          classes.push('focus:border-gray-600 dark:focus:border-gray-600')
        }

        switch (variant) {
          case 'solid': {
            classes.push('text-white')
            classes.push('bg-gray-500 dark:bg-gray-700')

            if (bgHover) {
              classes.push('hover:bg-gray-600 dark:hover:bg-gray-600')
            }
            if (border) {
              classes.push('border-gray-700 dark:border-gray-600')
            }

            return classes
          }
          case 'dim': {
            classes.push('text-gray-500 dark:text-gray-500')
            classes.push('disabled:text-gray-500 disabled:dark:text-gray-500')
            classes.push('hover:text-gray-700 dark:hover:text-gray-400')
            classes.push('bg-gray-100 dark:bg-gray-900')

            if (bgHover) {
              classes.push('hover:bg-gray-200 dark:hover:bg-gray-800')
              classes.push('disabled:hover:bg-gray-100 dark:hover:bg-gray-900')
            }
            if (border) {
              classes.push('border-gray-200 dark:border-gray-700')
            }

            return classes
          }
          default:
          case 'link': {
            classes.push('text-gray-500 dark:text-gray-500')
            classes.push('disabled:text-gray-500 disabled:dark:text-gray-500')
            classes.push('hover:text-gray-700 dark:hover:text-gray-400')

            if (bgHover) {
              classes.push('hover:bg-gray-100 dark:hover:bg-gray-900')
            }
            if (border) {
              classes.push('border-gray-400 dark:border-gray-500')
            }

            return classes
          }
        }
      }
    }
  }

  const getRingClasses = () => {
    if (!ring) return

    switch (color) {
      case 'cyan': {
        return [
          DEFAULT_RING,
          'focus:ring-cyan-400 dark:focus:ring-cyan-500 focus:border-cyan-700',
          border ? 'dark:focus:border-cyan-500' : 'dark:focus:border-cyan-700',
        ]
      }
      default:
      case 'blue': {
        return [
          DEFAULT_RING,
          'focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-700',
          border ? 'dark:focus:border-blue-500' : 'dark:focus:border-blue-700',
        ]
      }
    }
  }

  const classes = cx(
    'relative inline-block align-baseline transition',
    'no-underline whitespace-nowrap cursor-pointer',
    selectable ? 'select-text' : 'select-none',
    spacing,
    getColorClasses(),
    getRingClasses(),
    round && 'rounded-md',
    !border && 'border-transparent dark:border-transparent',
    'border border-opacity-50 dark:border-opacity-25',
    'focus:outline-none',
    'font-[number:var(--freq-button-weight)]',
    'disabled:cursor-not-allowed disabled:opacity-40',
    (color === 'none' || variant === 'link') &&
      'disabled:hover:bg-transparent disabled:hover:dark:bg-transparent',
    className
  )

  const anchorProps = omit(
    props as AnchorHtmlProps & { navigate: unknown },
    'navigate'
  )
  if (anchorProps.href !== undefined) {
    return (
      <a {...anchorProps} className={classes} onClick={handleClick}>
        {children}
      </a>
    )
  }

  return (
    <button
      {...props}
      type={htmlType}
      className={classes}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
