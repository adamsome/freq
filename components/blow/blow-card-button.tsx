import type { ReactNode } from 'react'
import React from 'react'
import { cx } from '../../lib/util/dom'
import IconSvg from '../control/icon-svg'
import { BlowCardProps } from './blow-card'
import BlowCardShape from './blow-card-shape'
import { BlowRoleView } from './blow-role-card-view'
import BlowRoleIcon from './icons/blow-role-icon'

type Props = BlowCardProps & {
  children?: ReactNode
  view: BlowRoleView
}

export default function BlowCardButton(props: Props) {
  const {
    children,
    className = '',
    id,
    index,
    size = 'sm',
    variant = 'facedown',
    color = 'gray',
    killed,
    theme,
    view,
    selectable,
    selected,
    onClick,
  } = props
  const sm = size === 'xs' || size === 'sm'
  const md = size === 'md'
  const lg = size === 'lg' || size === 'xl'
  const bright = sm || selectable
  const magicRole = theme !== 'classic'

  const asButton = selectable && onClick
  const Component = asButton ? 'button' : 'div'

  return (
    <BlowCardShape {...props}>
      <Component
        type={asButton ? 'button' : undefined}
        className={cx(className, {
          relative: true,
          full: true,
          'p-px': sm && variant === 'facedown',
          'p-0.5 xs:p-1.5': !sm,
          'bg-white dark:bg-black': !sm,
          'border-gray-300 dark:border-gray-700': sm && color === 'gray',
          'border-gray-300 dark:border-cyan-950': !sm && color === 'gray',
          'border-cyan-600 dark:border-cyan-500': color === 'cyan' && bright,
          'hover:border-cyan-800': color === 'cyan' && bright,
          'dark:hover:border-cyan-400': color === 'cyan' && bright,
          group: selectable,
          'transition-colors': color === 'cyan' && bright,
          'border-cyan-400 dark:border-cyan-800': color === 'cyan' && !bright,
          'border-2 border-dashed': variant === 'empty',
          border: !sm || variant !== 'faceup',
          'border-0': sm && variant === 'faceup',
          'rounded-sm': sm,
          'rounded-md': !sm,
          'focus:outline-none': true,
          'focus:ring-4 focus:ring-opacity-25 dark:focus:ring-opacity-25':
            selectable,
          'focus:ring-cyan-400 dark:focus:ring-cyan-500': selectable,
          'focus:border-cyan-700': selectable,
          'dark:focus:border-cyan-500': selectable,
          shadow: true,
          'cursor-pointer': onClick != null,
        })}
        onClick={(e) => {
          e.preventDefault()
          id != null && onClick?.(id, index ?? 0)
        }}
      >
        {children}
      </Component>

      {(selectable || selected != null) && !killed && (
        <Component
          type={asButton ? 'button' : undefined}
          className={cx(`
            pointer-events-none
            absolute top-2 right-2
            ${!asButton ? 'flex-center flex-col' : ''}
            h-8 w-8
            touch-manipulation select-none
            bg-none
            text-center leading-none no-underline outline-none
            transition-all
          `)}
        >
          <div
            className={cx(`
              ${
                selected ? 'scale-150 bg-cyan-500 shadow' : 'border-cyan-500/70'
              }
              relative inline-block
              h-4 w-4
              rounded-full border-2 border-cyan-500
              text-center text-[9px] leading-none text-black/75
              transition-all
            `)}
          >
            {selected && (
              <IconSvg
                className={cx(`
                  absolute top-2/4 left-2/4
                  -translate-x-2/4 -translate-y-2/4
                  overflow-hidden
                `)}
                name="checkbox"
              />
            )}
          </div>
        </Component>
      )}

      {magicRole && id && (
        <div
          className={cx('full flex-center pointer-events-none absolute', {
            'top-0.5': sm,
            '-top-2': md,
            '-top-4': lg,
          })}
        >
          <BlowRoleIcon
            className={cx(view.classes.roleIcon, {
              'w-5': sm,
              'w-[4.5rem]': md,
              'w-20': lg,
            })}
            role={id}
          />
        </div>
      )}

      {killed && (
        <div
          className={cx('full flex-center absolute', {
            'bg-white/50 dark:bg-black/50': !sm,
            'bg-white/25 dark:bg-black/5': sm,
          })}
        >
          <IconSvg
            className={cx({
              'h-[16.666px] w-[14.4295px]': sm,
              'h-[71.875px] w-[62.22721875px]': md,
              'h-[100px] w-[86.577px]': lg,
              'text-red-500/75': true,
            })}
            name="skull"
            top={sm ? '0' : '-8%'}
          />
        </div>
      )}
    </BlowCardShape>
  )
}
