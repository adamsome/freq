import type { MouseEvent } from 'react'
import invariant from 'tiny-invariant'
import {
  getBlowRoleAction,
  isBlowRoleActionDef,
} from '../../lib/blow/blow-role-action-defs'
import {
  BlowActionState,
  BlowCardSize,
  BlowRoleActionDef,
  BlowRoleActionID,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowActionButtonIcon from './blow-action-button-icon'
import BlowLabel from './tokens/blow-label'

type Props = {
  className?: string
  id?: BlowRoleActionID
  size?: BlowCardSize
  state?: BlowActionState
  theme?: BlowThemeID
  passClicks?: boolean
  fetching?: boolean
  onClick?: (id: BlowRoleActionID) => void
}

const BG = {
  cyan: 'bg-cyan-300 dark:bg-cyan-500',
  red: 'bg-red-400 dark:bg-red-500',
  gray: 'bg-slate-600 dark:bg-gray-500',
}

const TEXT = {
  body: 'text-black dark:text-white',
  black: 'text-black dark:text-black',
  cyan: 'text-cyan-600 dark:text-cyan-400',
  cyanHover: 'hover:text-cyan-700 dark:hover:text-cyan-300',
  cyanHoverGroup: 'group-hover:text-cyan-700 dark:group-hover:text-cyan-300',
  red: 'text-red-500 dark:text-red-400',
  redHover: 'hover:text-red-700 dark:hover:text-red-300',
  redHoverGroup: 'group-hover:text-red-700 dark:group-hover:text-red-300',
}

const TEXT_OPACITY = {
  40: 'text-opacity-40 dark:text-opacity-40',
  80: 'text-opacity-80 dark:text-opacity-80',
  100: 'text-opacity-100 dark:text-opacity-100',
}

export default function BlowActionButton({
  className = '',
  id,
  size = 'sm',
  state = 'normal',
  theme,
  passClicks,
  fetching,
  onClick,
}: Props) {
  const sm = size === 'xs' || size === 'sm'
  const md = size === 'md'
  const lg = size === 'lg' || size === 'xl'
  const heightCx = sm
    ? 'h-1'
    : md
    ? 'h-4'
    : 'h-[var(--blow-action-button-min-height)] min-h-[var(--blow-action-button-min-height)]'

  if (!id) {
    return <div className={cx(heightCx, className)}></div>
  }

  invariant(theme != null, 'BlowActionButton: Theme must be provided')

  const action = getBlowRoleAction(theme, id)
  invariant(
    isBlowRoleActionDef(action),
    `BlowActionButton: BlowActionDef for '${id}' invalid`
  )

  let counter: BlowRoleActionDef | undefined
  if (action.counter) {
    counter = getBlowRoleAction(theme, action.counter)
    invariant(
      isBlowRoleActionDef(counter),
      `BlowActionButton: BlowActionDef counter for '${action.counter}' invalid`
    )
  }

  const invert = state === 'active' || state === 'counter'
  const color = invert ? 'black' : state === 'clickable' ? 'cyan' : 'gray'

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    if (state !== 'clickable' && !passClicks) return
    onClick?.(id)
  }

  const asButton = state === 'clickable'
  const Component = asButton ? 'button' : 'div'

  return (
    <Component
      type={asButton ? 'button' : undefined}
      className={cx(
        'relative align-baseline flex-center group transition',
        'w-full m-0',
        sm ? 'pt-[0.09375rem]' : md ? '-my-px' : 'pl-0.5 py-0.5',
        sm
          ? 'text-[2.25px] leading-normal'
          : md
          ? 'text-[0.6288625rem]'
          : 'text-sm',
        !sm && 'rounded-sm',
        heightCx,
        'tracking-normal',
        state === 'clickable' || passClicks ? 'cursor-pointer' : 'cursor-auto',
        state === 'active' && BG.cyan,
        state === 'counter' && BG.red,
        state === 'clickable' && [
          !action.counter ? TEXT.cyan : TEXT.red,
          !action.counter ? TEXT.cyanHover : TEXT.redHover,
          BG.gray,
          'bg-opacity-10 dark:bg-opacity-30',
          'hover:bg-opacity-30 dark:hover:bg-opacity-40',
          'border-gray-500 dark:border-gray-500',
          'border-opacity-10 dark:border-opacity-10',
          !sm && 'shadow',
          !sm &&
            'focus:ring-4 focus:ring-opacity-25 dark:focus:ring-opacity-25',
          'focus:ring-blue-400 focus:border-blue-700',
          'dark:focus:ring-blue-500 dark:focus:border-blue-700',
        ],
        invert ? TEXT.black : TEXT.body,
        invert || state === 'clickable' ? TEXT_OPACITY[100] : TEXT_OPACITY[80],
        !lg ? 'border-0' : 'border',
        state !== 'clickable' && 'border-transparent dark:border-transparent',
        'focus:outline-none',
        state !== 'normal' && !sm && 'shadow',
        className
      )}
      onClick={handleClick}
    >
      {(counter || action.coins != null) && (
        <div
          className={cx(
            'flex self-baseline',
            sm ? 'w-[3px]' : md ? 'w-[14px]' : 'w-[19px]'
          )}
        >
          <BlowActionButtonIcon
            action={action}
            counter={counter}
            fetching={fetching}
            color={color}
            size={size}
          />
        </div>
      )}

      <div
        className={cx(
          'flex-1 text-left',
          sm ? 'leading-normal' : 'leading-tight'
        )}
      >
        <BlowLabel
          className={cx(
            state === 'clickable'
              ? [
                  !action.counter ? TEXT.cyanHoverGroup : TEXT.redHoverGroup,
                  'transition-all',
                ]
              : invert
              ? TEXT.black
              : TEXT.body,
            invert || state === 'clickable'
              ? TEXT_OPACITY[100]
              : TEXT_OPACITY[80],
            counter && 'font-semibold'
          )}
          label={action?.counterLabel ?? counter?.name ?? action.label}
          theme={theme}
          coinProps={{ color, size: sm ? 'xs' : md ? 'sm' : 'md' }}
        />
      </div>
    </Component>
  )
}
