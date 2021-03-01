/*! ant-design v4.12.3 | MIT License | https://github.com/ant-design/ant-design/blob/master/components/button/button.tsx */
import React from 'react'
import { cx } from '../util/dom'
import { omit } from '../util/object'

const ButtonHTMLTypes = ['submit', 'button', 'reset'] as const
export type ButtonHTMLType = typeof ButtonHTMLTypes[number]

type BaseProps = typeof defaultProps & {
  children: React.ReactNode
  gray?: boolean
  red?: boolean
}

const defaultProps = {
  className: '',
  blue: true,
  solid: false,
  round: true,
  ring: true,
}

type AnchorProps = {
  href: string
  target?: string
  onClick?: React.MouseEventHandler<HTMLElement>
} & BaseProps &
  Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>

type ButtonProps = {
  htmlType?: ButtonHTMLType
  onClick?: React.MouseEventHandler<HTMLElement>
} & BaseProps &
  Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>

type Props = Partial<AnchorProps & ButtonProps>

export default function Button({
  className,
  children,
  blue: _blue,
  gray,
  red,
  solid,
  round,
  ring,
  htmlType = 'button' as Props['htmlType'],
  ...props
}: Props) {
  const blue = !gray && !red && _blue

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
  ) => {
    const { onClick } = props
    const _onClick = onClick as React.MouseEventHandler<
      HTMLButtonElement | HTMLAnchorElement
    >
    _onClick?.(e)
  }

  const classes = cx(
    'relative inline-block align-baseline',
    'm-0 py-0 px-3',
    'no-underline whitespace-nowrap cursor-pointer select-none',
    'bg-transparent transition',
    {
      'text-white': solid,
      'bg-blue-700 hover:bg-blue-900 dark:hover:bg-blue-600': blue && solid,
      'bg-gray-500 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600':
        gray && solid,
      'bg-red-700 hover:bg-red-900 dark:hover:bg-red-600': red && solid,
      'text-blue-600 hover:text-blue-800': blue && !solid,
      'dark:text-blue-700 dark:hover:text-blue-600': blue && !solid,
      'text-gray-500 hover:text-gray-700': gray && !solid,
      'dark:text-gray-500 dark:hover:text-gray-400': gray && !solid,
      'text-red-700 hover:text-red-900': red && !solid,
      'dark:text-red-800 dark:hover:text-red-700': red && !solid,
      'hover:bg-blue-100 dark:hover:bg-blue-950': blue && !solid,
      'hover:bg-gray-100 dark:hover:bg-gray-900': gray && !solid,
      'hover:bg-red-100 dark:hover:bg-red-950': red && !solid,
      'rounded-md': round,
      'focus:ring-4 focus:ring-blue-400 focus:ring-opacity-25': ring,
      'dark:focus:ring-blue-500 dark:focus:ring-opacity-25': ring,
      'focus:border-blue-700': ring,
    },
    'border border-transparent',
    'font-semibold focus:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-40',
    className
  )

  const anchorProps = omit(props as AnchorProps & { navigate: any }, 'navigate')
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

Button.defaultProps = defaultProps
