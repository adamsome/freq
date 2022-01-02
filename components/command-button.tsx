import type { MouseEvent } from 'react'
import { Command, Player } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import { styleColor } from '../lib/util/dom-style'
import Button from './button'
import IconSvg from './icon-svg'

type Props = typeof defaultProps & {
  command: Command
  currentPlayer?: Player
  onClick: (e: MouseEvent, cmd: Command, i?: number) => Promise<void>
}

const defaultProps = {
  fetching: false,
}

const CommandButton = ({
  command,
  currentPlayer,
  fetching,
  onClick,
}: Props) => {
  const cmd = command

  const getCmdRightWidth = (cmd: Command) => {
    const w = (cmd.rightWidth ?? 0.5) * 100
    const min = '6.5em'
    const rawWidth = `calc(${w}% - 0.25rem)`
    return `max(${min}, min(${rawWidth}, calc(100% - ${min})))`
  }

  const button = ({ right }: { right?: boolean } = {}) => {
    const flex = `0 0 ${getCmdRightWidth(cmd)}`
    const player = !cmd.disabled ? currentPlayer : undefined
    const color = (right ? cmd.rightColor : cmd.color) ?? player
    const disabled =
      fetching ||
      cmd.fetching ||
      (right ? cmd.rightDisabled ?? cmd.disabled ?? false : cmd.disabled)

    const style: React.CSSProperties | undefined = styleColor(color, 1)
    if (style && right) {
      style.flex = flex
    }

    return (
      <Button
        className={cx(
          'flex-1 bg-gray-500 w-full text-xl py-2 px-2',
          'opacity-80 hover:opacity-100 transition-opacity',
          'inline-flex justify-center items-center',
          { 'ml-2': right }
        )}
        blue={false}
        style={style}
        disabled={disabled}
        onClick={(e) => onClick(e, cmd, right ? 1 : 0)}
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
        {button()}

        {cmd.rightText != null && button({ right: true })}
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

CommandButton.defaultProps = defaultProps

export default CommandButton
