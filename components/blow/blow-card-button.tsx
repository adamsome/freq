import type { ReactNode } from 'react'
import React from 'react'
import { cx } from '../../lib/util/dom'
import IconSvg from '../control/icon-svg'
import { BlowCardProps } from './blow-card'
import BlowCardShape from './blow-card-shape'

type Props = BlowCardProps & {
  children?: ReactNode
  className?: string
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
    selectable,
    selected,
    onClick,
  } = props
  const sm = size === 'xs' || size === 'sm'
  const bright = sm || selectable

  const asButton = selectable && onClick
  const Component = asButton ? 'button' : 'div'

  return (
    <BlowCardShape {...props}>
      <Component
        type={asButton ? 'button' : undefined}
        className={cx(className, {
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
          className={cx(
            'absolute top-2 right-2',
            !asButton && 'flex-center flex-col',
            'w-8 h-8',
            'leading-none',
            'text-center',
            'bg-none',
            'no-underline',
            'touch-manipulation',
            'select-none',
            'outline-none',
            'transition-all',
            'pointer-events-none'
          )}
        >
          <div
            className={cx({
              relative: true,
              'inline-block': true,
              'w-4 h-4': true,
              'text-[9px]': true,
              'leading-none': true,
              'text-center': true,
              'text-black/75': true,
              'bg-cyan-500': selected,
              'border-2': true,
              'border-cyan-500/70': !selected,
              'border-cyan-500': true,
              shadow: selected,
              'rounded-full': true,
              'scale-150': selected,
              'transition-all': true,
            })}
          >
            {selected && (
              <IconSvg
                className={cx(
                  'overflow-hidden',
                  'absolute top-2/4 left-2/4',
                  '-translate-x-2/4 -translate-y-2/4'
                )}
                name="checkbox"
              />
            )}
          </div>
        </Component>
      )}

      {killed && (
        <div
          className={cx(
            'absolute full flex-center',
            'bg-white/50 dark:bg-black/25'
          )}
        >
          <IconSvg
            className={cx({
              'w-[14.4295px] h-[16.666px]': sm,
              'w-[86.577px] h-[100px]': !sm,
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
