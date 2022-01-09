import type { MouseEvent } from 'react'
import invariant from 'tiny-invariant'
import {
  BLOW_ROLE_ACTIONS_DEFS,
  isBlowRoleActionDef,
} from '../../lib/blow/blow-role-action-defs'
import {
  BlowRoleActionDef,
  BlowRoleActionID,
  BlowActionState,
  BlowCardSize,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowActionButtonIcon from './blow-action-button-icon'
import BlowLabel from './blow-label'

type Props = {
  className?: string
  id?: BlowRoleActionID
  size?: BlowCardSize
  state?: BlowActionState
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
  fetching,
  onClick,
}: Props) {
  const sm = size === 'xs' || size === 'sm'
  const heightCx = sm
    ? 'h-1'
    : 'h-[var(--blow-action-button-min-height)] min-h-[var(--blow-action-button-min-height)]'

  if (!id) {
    return <div className={cx(heightCx, className)}></div>
  }

  const action = BLOW_ROLE_ACTIONS_DEFS[id]
  invariant(
    isBlowRoleActionDef(action),
    `BlowActionButton: BlowActionDef for '${id}' invalid`
  )

  let counter: BlowRoleActionDef | undefined
  if (action.counter) {
    counter = BLOW_ROLE_ACTIONS_DEFS[action.counter as BlowRoleActionID]
    invariant(
      isBlowRoleActionDef(counter),
      `BlowActionButton: BlowActionDef counter for '${action.counter}' invalid`
    )
  }

  const invert = state === 'active' || state === 'counter'
  const color = invert ? 'black' : state === 'clickable' ? 'cyan' : 'gray'

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    if (state !== 'clickable') return
    onClick?.(id)
  }

  return (
    <button
      className={cx(
        'relative align-baseline flex-center group transition',
        'w-full m-0',
        sm ? 'pt-[0.09375rem]' : 'pl-0.5 py-0.5',
        sm ? 'text-[2.25px] leading-normal' : 'text-sm',
        !sm && 'rounded-sm',
        heightCx,
        state === 'clickable' ? 'cursor-pointer' : 'cursor-auto',
        state === 'active' && BG.cyan,
        state === 'counter' && BG.red,
        state === 'clickable' && [
          TEXT.cyan,
          TEXT.cyanHover,
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
        sm ? 'border-0' : 'border',
        state !== 'clickable' && 'border-transparent dark:border-transparent',
        'focus:outline-none',
        className
      )}
      onClick={handleClick}
    >
      <div className={cx('flex self-baseline', sm ? 'w-[3px]' : 'w-[19px]')}>
        <BlowActionButtonIcon
          action={action}
          counter={counter}
          fetching={fetching}
          color={color}
          size={size}
        />
      </div>

      <div
        className={cx(
          'flex-1 text-left',
          sm ? 'leading-normal' : 'leading-tight'
        )}
      >
        <span
          className={cx(
            'transition-all',
            sm ? 'mr-0' : 'mr-0.5',
            !counter && 'font-semibold'
          )}
        >
          {action.name}:{' '}
        </span>

        <BlowLabel
          className={cx(
            state === 'clickable'
              ? [TEXT, TEXT.cyanHoverGroup, 'transition-all']
              : invert
              ? TEXT.black
              : TEXT.body,
            counter
              ? invert || state === 'clickable'
                ? TEXT_OPACITY[100]
                : TEXT_OPACITY[80]
              : invert || state === 'clickable'
              ? TEXT_OPACITY[80]
              : TEXT_OPACITY[40],
            counter && 'font-semibold'
          )}
          label={counter?.name ?? action.label}
          coinProps={{ color, size: sm ? 'xs' : 'sm' }}
        />
      </div>
    </button>
  )
}
