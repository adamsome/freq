import type { ReactNode } from 'react'
import invariant from 'tiny-invariant'
import { getBlowRole, isBlowRoleDef } from '../../lib/blow/blow-role-defs'
import {
  BlowActionState,
  BlowCardColor,
  BlowCardSize,
  BlowCardSource,
  BlowCardVariant,
  BlowRoleActionID,
  BlowRoleID,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import SkeletonBox from '../layout/skeleton-box'
import BlowActionButton from './blow-action-button'
import BlowCardButton from './blow-card-button'
import BlowCardFacedownPattern from './blow-card-facedown-pattern'
import BlowCardTitle from './blow-card-title'
import getBlowRoleView, { BlowRoleView } from './blow-role-card-view'

type Props = {
  id?: BlowRoleID | null
  index?: number
  size?: BlowCardSize
  orientation?: 'horizontal' | 'vertical'
  variant?: BlowCardVariant
  color?: BlowCardColor
  killed?: boolean
  selectable?: boolean
  selected?: boolean
  actions?: Partial<Record<BlowRoleActionID, BlowActionState>>
  currentCards?: number
  theme?: BlowThemeID
  fetching?: BlowRoleActionID | null
  onActionClick?: (id: BlowRoleActionID) => void
  onClick?: (id: BlowRoleID, i: number, source?: BlowCardSource) => void
}

export type BlowCardProps = Props

export default function BlowCard(props: Props) {
  const { theme, id, actions, killed } = props
  const view = getBlowRoleView(theme, id, actions, {
    clickable: true,
    disable: killed,
  })
  return (
    <BlowCardButton {...props} view={view}>
      <BlowCardContent {...props} view={view} />
    </BlowCardButton>
  )
}

function BlowCardContent(props: Props & { view: BlowRoleView }) {
  const {
    id,
    size = 'sm',
    variant = 'facedown',
    theme,
    actions = {},
    currentCards = 0,
    orientation,
    fetching,
    selectable,
    view,
    onActionClick,
  } = props

  if (variant === 'empty') return null

  if (variant === 'facedown') return <BlowCardFacedownPattern {...props} />

  if (!id || !theme) return <SkeletonBox color="cyan" className="full" />

  const role = getBlowRole(theme, id)
  invariant(isBlowRoleDef(role), `BlowCard: BlowCardRole for '${id}' invalid`)

  const vertical = orientation !== 'horizontal'
  const sm = size === 'xs' || size === 'sm'
  const md = size === 'md'
  const lg = size === 'lg' || size === 'xl'

  return (
    <BlowCardContentWrapper {...props} view={view} center={role.common}>
      {!role.common && (
        <BlowCardTitle
          className="mb-1"
          {...props}
          currentCards={!sm ? currentCards : 0}
          theme={theme}
        >
          {role.name}
        </BlowCardTitle>
      )}

      {!role.common && (
        <div
          className={cx(!sm && !vertical && 'hidden xs:block', 'flex-1')}
        ></div>
      )}

      {!sm && (
        <div
          className={cx({
            'flex flex-col justify-between': role.common,
            'h-full': role.common,
            'space-y-0': sm,
            'space-y-1.5': md,
            'space-y-0.5 xs:space-y-1.5': lg && !vertical,
            'space-y-1': lg && vertical,
          })}
        >
          {role.actions.map((a) => (
            <BlowActionButton
              key={a}
              id={a}
              size={size}
              state={
                // If we're fetching, set clickable actions to normal
                (fetching && fetching !== a && actions[a] === 'clickable') ||
                theme !== 'classic'
                  ? 'normal'
                  : actions[a]
              }
              passClicks={selectable}
              theme={theme}
              fetching={fetching === a}
              onClick={(id) => !selectable && onActionClick?.(id)}
            />
          ))}

          {!role.common && role.actions.length < 2 && role.hasNoCounters && (
            // Blank space where counter actions usually appear
            <BlowActionButton
              className="hidden xs:flex"
              size={size}
              theme={theme}
            />
          )}
        </div>
      )}
    </BlowCardContentWrapper>
  )
}

type ContentWrapperProps = Omit<Props, 'onActionClick'> & {
  children: ReactNode
  center?: boolean
  view: BlowRoleView
}

function BlowCardContentWrapper(props: ContentWrapperProps) {
  const { children, size = 'sm', selectable, view, center = false } = props
  const sm = size === 'xs' || size === 'sm'
  return (
    <div
      className={cx(view.classes.button, {
        'flex flex-col full': true,
        'justify-center': center,
        'px-0.5 pt-0 pb-0.5': sm,
        'px-1.5 pt-0.5 pb-1.5': !sm && !center,
        'p-1.5': !sm && center,
        // 'bg-cyan-200 dark:bg-cyan-925': sm,
        // 'bg-cyan-100 dark:bg-cyan-975':
        //   !sm && !selected && (!hasCard || selectable),
        // 'bg-cyan-200 dark:bg-cyan-950':
        //   !sm && (selected || (hasCard && !selectable)),
        // 'group-hover:bg-cyan-200 dark:group-hover:bg-cyan-950':
        //   !sm && selectable,
        border: true,
        'transition-colors': !sm && selectable,
        'font-narrow': true,
        'text-black dark:text-white': true,
        'rounded-sm': true,
        'select-none': true,
      })}
    >
      {children}
    </div>
  )
}
