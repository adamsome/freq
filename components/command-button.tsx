import type { CSSProperties, MouseEvent } from 'react'
import { Command, Player } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import { styleColor } from '../lib/util/dom-style'
import Button, { ButtonProps } from './control/button'
import IconSvg from './control/icon-svg'

type Props = {
  command: Command
  currentPlayer?: Player
  button?: ButtonProps
  rightButton?: ButtonProps
  spacingClassName?: string
  fetching?: boolean
  onClick: (e: MouseEvent, cmd: Command, colIndex?: number) => Promise<void>
}

const CommandButton = ({
  command,
  currentPlayer,
  button = {},
  rightButton = {},
  spacingClassName = 'm-0 px-2 py-2',
  fetching = false,
  onClick,
}: Props) => {
  const cmd = command

  const getCmdRightWidth = (cmd: Command) => {
    const w = (cmd.rightWidth ?? 0.5) * 100
    const min = '6.5em'
    const rawWidth = `calc(${w}% - 0.25rem)`
    return `max(${min}, min(${rawWidth}, calc(100% - ${min})))`
  }

  const createButton = ({ right }: { right?: boolean } = {}) => {
    const flex = `0 0 ${getCmdRightWidth(cmd)}`

    const { className, ...props } = right ? rightButton : button

    let style: CSSProperties | undefined
    if (!props.color) {
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
          'flex-1 w-full text-xl',
          'opacity-80 hover:opacity-100 transition-opacity',
          'inline-flex justify-center items-center',
          { 'ml-2': right },
          className
        )}
        color="none"
        bgHover={false}
        style={style}
        spacing={spacingClassName}
        disabled={disabled}
        onClick={(e) => onClick(e, cmd, right ? 1 : 0)}
        {...props}
      >
        {fetching || cmd.fetching ? (
          <IconSvg name="spinner" className="w-7 h-7 text-white" />
        ) : right ? (
          cmd.rightText
        ) : (
          cmd.text
        )}
      </Button>
    )
  }

  return (
    <>
      <div
        key={cmd.type + cmd.text + cmd.info + cmd.rightText}
        className={cx('flex-center w-full', {
          'text-xl': !cmd.rightText,
          'text-lg': cmd.rightText,
        })}
      >
        {createButton()}

        {cmd.rightText != null && createButton({ right: true })}
      </div>

      {cmd.info && (
        <div
          className="text-center text-gray-500 font-light mt-1 text-sm sm:text-base leading-tight"
          style={styleColor(cmd.infoColor)}
        >
          {cmd.info}
        </div>
      )}
    </>
  )
}

export default CommandButton
