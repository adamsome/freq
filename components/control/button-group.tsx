import { cx } from '../../lib/util/dom'
import Button from './button'

type Props = typeof defaultProps & {
  buttons: string[]
  onClick: (text: string, i: number) => void
}

const defaultProps = {
  selected: 0,
  disabled: false,
  /** Width of individual button in 1/4 rems. */
  width: 20,
}

export default function ButtonGroup({
  buttons,
  selected,
  width,
  disabled,
  onClick,
}: Props) {
  return (
    <div className="flex-center rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
      {buttons.map((text, i) => (
        <Button
          key={text + i}
          className={cx('text-sm sm:text-base', `w-${width}`, {
            'mr-0.5': i !== buttons.length - 1,
            'ml-0.5': i !== 0,
          })}
          color="gray"
          variant={i === selected ? 'solid' : 'link'}
          disabled={disabled}
          onClick={() => !disabled && selected !== i && onClick(text, i)}
        >
          {text}
        </Button>
      ))}
    </div>
  )
}

ButtonGroup.defaultProps = defaultProps
