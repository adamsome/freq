import type {
  ChangeEventHandler,
  FocusEventHandler,
  InputHTMLAttributes,
} from 'react'
import { cx } from '../../lib/util/dom'

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
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const defaultProps = {
  className: '',
  selectOnFocus: false,
}

type Props = {
  htmlType?: InputHTMLType
  onChange?: ChangeEventHandler<HTMLInputElement>
} & BaseProps &
  Omit<InputHTMLAttributes<unknown>, 'type' | 'onChange'>

export default function Input({
  className,
  selectOnFocus,
  htmlType = 'text' as Props['htmlType'],
  ...props
}: Props) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    props.onChange?.(e)
  }

  const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    if (selectOnFocus) {
      e.currentTarget.select()
    }
    props.onFocus?.(e)
  }

  return (
    <input
      {...props}
      className={cx(`
        disabled:color-gray-500
        whitespace-nowrap
        rounded-lg border
        border-gray-300
        bg-white
        text-black
        placeholder-gray-400
        transition
        hover:border-blue-700
        focus:border-blue-700
        focus:outline-none
        focus:ring-4
        focus:ring-blue-400
        focus:ring-opacity-25
        disabled:cursor-not-allowed
        dark:border-gray-900
        dark:bg-gray-900
        dark:text-white
        dark:placeholder-gray-600
        dark:hover:border-blue-700
        dark:focus:border-blue-700
        dark:focus:ring-blue-500
        dark:focus:ring-opacity-25
        ${className}
      `)}
      type={htmlType}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  )
}

Input.defaultProps = defaultProps
