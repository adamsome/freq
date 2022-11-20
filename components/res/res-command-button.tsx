import type { CSSProperties, MouseEvent } from 'react'
import { Command, Player } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { styleColor } from '../../lib/util/dom-style'
import Button, { ButtonProps } from '../control/button'
import IconSvg from '../control/icon-svg'
import TimerSpinner from '../control/timer-spinner'

type Props = {
  command: Command
  currentPlayer?: Player
  button?: ButtonProps
  rightButton?: ButtonProps
  spacingClassName?: string
  fullHeight?: boolean
  fetching?: boolean
  onClick?: (e: MouseEvent, cmd: Command, colIndex?: number) => Promise<void>
  onTimerFinish?: (colIndex?: number) => void
}

export type CommandButtonProps = Props

export default function ResCommandButton(props: Props) {
  const cmd = props.command

  return (
    <>
      <div
        key={cmd.type + cmd.text + cmd.info + cmd.rightText}
        className={cx('flex-center w-full', {
          'h-full': props.fullHeight,
          'text-xl': !cmd.rightText,
          'text-lg': cmd.rightText,
        })}
      >
        <SideButton {...props} />

        {cmd.rightText != null && <SideButton right {...props} />}
      </div>

      {cmd.info && (
        <div
          className="mt-1 text-center text-sm font-light leading-tight text-gray-500 sm:text-base"
          style={styleColor(cmd.infoColor)}
        >
          {cmd.info}
        </div>
      )}
    </>
  )
}

type SubProps = Props & {
  right?: boolean
  skipTimer?: boolean
}

function SideButton(props: SubProps) {
  const {
    right,
    command: cmd,
    currentPlayer,
    button = {},
    rightButton = {},
    spacingClassName = 'm-0 px-2 py-2',
    fullHeight,
    fetching = false,
    onClick,
  } = props

  const getCmdRightWidth = (cmd: Command) => {
    const w = (cmd.rightWidth ?? 0.5) * 100
    const min = '6.5em'
    const rawWidth = `calc(${w}% - 0.25rem)`
    return `max(${min}, min(${rawWidth}, calc(100% - ${min})))`
  }

  const flex = `0 0 ${getCmdRightWidth(cmd)}`

  const { className, ...buttonProps } = right ? rightButton : button

  let style: CSSProperties | undefined
  if (!buttonProps.color) {
    const player = !cmd.disabled ? currentPlayer : undefined
    const color = (right ? cmd.rightColor : cmd.color) ?? player
    const bg = (right ? cmd.rightColorLit : cmd.colorLit) ?? 1
    const border = (right ? cmd.rightColorBorder : cmd.colorBorder) ?? 0
    style = styleColor(color, bg, border)
  }

  const disabled =
    fetching ||
    cmd.fetching ||
    (right ? cmd.rightDisabled ?? cmd.disabled ?? false : cmd.disabled)

  if (style && right) {
    style.flex = flex
  }

  return (
    <Button
      className={cx(
        `inline-flex w-full flex-1 items-center justify-center
        text-xl opacity-80 transition-opacity hover:opacity-100`,
        { 'ml-2': right, 'h-full': fullHeight },
        className
      )}
      color="none"
      bgHover={false}
      style={style}
      spacing={spacingClassName}
      disabled={disabled}
      onClick={(e) => onClick?.(e, cmd, right ? 1 : 0)}
      {...buttonProps}
    >
      <ButtonContent {...props} />
    </Button>
  )
}

function ButtonContent({
  right,
  command,
  fetching = false,
  onTimerFinish,
}: SubProps) {
  if (fetching || command.fetching)
    return <IconSvg name="spinner" className="h-7 w-7 text-white" />

  const text = right ? command.rightText : command.text
  const timer = right ? command.rightTimer : command.timer

  if (!timer) return <>{text}</>

  return (
    <>
      <span>{text}</span>
      <div className="absolute right-1.5">
        <TimerSpinner
          duration={timer}
          onFinish={() => onTimerFinish?.(right ? 1 : 0)}
        />
      </div>
    </>
  )
}
