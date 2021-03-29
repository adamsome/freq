import React from 'react'
import { cx } from '../util/dom'

const InputHTMLType = [
  'button',
  'checkbox',
  'color',
  'date',
  'datetime-local',
  'email',
  'file',
  'hidden',
  'image',
  'month',
  'number',
  'password',
  'radio',
  'range',
  'reset',
  'search',
  'submit',
  'tel',
  'text',
  'time',
  'url',
  'week',
] as const
export type InputHTMLType = typeof InputHTMLType[number]

type BaseProps = typeof defaultProps & {
  htmlType?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const defaultProps = {
  className: '',
  selectOnFocus: false,
}

type Props = {
  htmlType?: InputHTMLType
  onChange?: React.ChangeEventHandler<HTMLInputElement>
} & BaseProps &
  Omit<React.InputHTMLAttributes<any>, 'type' | 'onChange'>

export default function Input({
  className,
  selectOnFocus,
  htmlType = 'text' as Props['htmlType'],
  ...props
}: Props) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    props.onChange?.(e)
  }

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    if (selectOnFocus) {
      e.currentTarget.select()
    }
    props.onFocus?.(e)
  }

  return (
    <input
      {...props}
      className={cx(
        'bg-white dark:bg-gray-900',
        'border border-gray-300 dark:border-gray-900 rounded-lg',
        'hover:border-blue-700 dark:hover:border-blue-700',
        'focus:border-blue-700 dark:focus:border-blue-700',
        'focus:outline-none',
        'focus:ring-4 focus:ring-blue-400 focus:ring-opacity-25',
        'dark:focus:ring-blue-500 dark:focus:ring-opacity-25',
        'text-black dark:text-white',
        'placeholder-gray-400 dark:placeholder-gray-600',
        'disabled:cursor-not-allowed disabled:color-gray-500',
        'transition whitespace-nowrap',
        className
      )}
      type={htmlType}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  )
}

Input.defaultProps = defaultProps
