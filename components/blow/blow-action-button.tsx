import type { MouseEvent } from 'react'
import invariant from 'tiny-invariant'
import { BLOW_ACTIONS_DEFS, isBlowActionDef } from '../../lib/blow/blow-actions'
import {
  BlowActionDef,
  BlowActionID,
  BlowActionState,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowActionButtonIcon from './blow-action-button-icon'
import BlowLabel from './blow-label'

type Props = {
  className?: string
  id: BlowActionID
  state?: BlowActionState
  onClick?: (id: BlowActionID) => void
}

export default function BlowActionButton({
  className = '',
  id,
  state = 'normal',
  onClick,
}: Props) {
  const action = BLOW_ACTIONS_DEFS[id]
  invariant(
    isBlowActionDef(action),
    `BlowActionButton: BlowActionDef for '${id}' invalid`
  )

  let counter: BlowActionDef | undefined
  if (action.counter) {
    counter = BLOW_ACTIONS_DEFS[action.counter as BlowActionID]
    invariant(
      isBlowActionDef(counter),
      `BlowActionButton: BlowActionDef counter for '${action.counter}' invalid`
    )
  }

  const invert = state === 'active' || state === 'counter'
  const color = invert ? 'white' : state === 'clickable' ? 'cyan' : 'gray'

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    if (state !== 'clickable') return
    onClick?.(id)
  }

  return (
    <button
      className={cx(
        'relative inline-block align-baseline flex-center transition',
        'w-full m-0 pl-0.5 py-0.5',
        'text-sm',
        'group',
        'rounded-sm',
        'min-h-[var(--blow-action-button-min-height)]',
        state === 'clickable' ? 'cursor-pointer' : 'cursor-auto',
        state === 'active' && 'bg-cyan-300 dark:bg-cyan-500',
        state === 'counter' && 'bg-red-400 dark:bg-red-500',
        state === 'clickable' && [
          'text-cyan-600 dark:text-cyan-400',
          'hover:text-cyan-700 dark:hover:text-cyan-300',
          'bg-slate-600 dark:bg-gray-500 bg-opacity-10 dark:bg-opacity-30',
          'border-gray-500 dark:border-gray-500 border-opacity-10 dark:border-opacity-10',
          'hover:bg-opacity-30 dark:hover:bg-opacity-40',
          'shadow',
        ],
        state !== 'clickable' && 'text-black dark:text-white',
        invert || state === 'clickable'
          ? 'text-opacity-100 dark:text-opacity-100'
          : 'text-opacity-80 dark:text-opacity-80',
        'border',
        state !== 'clickable' && 'border-transparent dark:border-transparent',
        'focus:outline-none',
        'focus:ring-4 focus:ring-opacity-25 dark:focus:ring-opacity-25',
        'focus:ring-blue-400 focus:border-blue-700',
        'dark:focus:ring-blue-500 dark:focus:border-blue-700',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex self-baseline w-[19px]">
        <BlowActionButtonIcon action={action} counter={counter} color={color} />
      </div>

      <div className="flex-1 text-left leading-tight">
        <span className={cx('mr-0.5', !counter && 'font-semibold')}>
          {action.name}:{' '}
        </span>

        <BlowLabel
          className={cx(
            state === 'clickable'
              ? 'text-cyan-600 dark:text-cyan-400 transition-colors ' +
                  'group-hover:text-cyan-700 dark:group-hover:text-cyan-300'
              : 'text-black dark:text-white',
            counter
              ? invert || state === 'clickable'
                ? 'text-opacity-100 dark:text-opacity-100'
                : 'text-opacity-80 dark:text-opacity-80'
              : invert || state === 'clickable'
              ? 'text-opacity-80 dark:text-opacity-80'
              : 'text-opacity-40 dark:text-opacity-40',
            counter && 'font-semibold'
          )}
          label={counter?.name ?? action.label}
          color={color}
        />
      </div>
    </button>
  )
}
