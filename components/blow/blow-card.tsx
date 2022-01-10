import type { ReactNode } from 'react'
import invariant from 'tiny-invariant'
import { BLOW_ROLE_DEFS, isBlowRoleDef } from '../../lib/blow/blow-role-defs'
import {
  BlowRoleActionID,
  BlowActionState,
  BlowCardColor,
  BlowRoleID,
  BlowCardSize,
  BlowCardVariant,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import SkeletonBox from '../layout/skeleton-box'
import BlowActionButton from './blow-action-button'
import BlowCardBorder from './blow-card-border'
import BlowCardFacedownPattern from './blow-card-facedown-pattern'
import BlowCardTitle from './blow-card-title'

type Props = {
  id?: BlowRoleID | null
  size?: BlowCardSize
  orientation?: 'horizontal' | 'vertical'
  variant?: BlowCardVariant
  color?: BlowCardColor
  actions?: Partial<Record<BlowRoleActionID, BlowActionState>>
  currentCards?: number
  fetching?: BlowRoleActionID | null
  onActionClick?: (id: BlowRoleActionID) => void
}

export type BlowCardProps = Props

export default function BlowCard({ ...props }: Props) {
  return (
    <BlowCardBorder {...props}>
      <BlowCardContent {...props} />
    </BlowCardBorder>
  )
}

function BlowCardContent({
  id,
  actions = {},
  size = 'sm',
  variant = 'facedown',
  color = 'gray',
  currentCards = 0,
  fetching,
  onActionClick,
}: Props) {
  if (variant === 'empty') return null

  if (variant === 'facedown') return <BlowCardFacedownPattern color={color} />

  if (!id) return <SkeletonBox color="cyan" className="full" />

  const role = BLOW_ROLE_DEFS[id]
  invariant(isBlowRoleDef(role), `BlowCard: BlowCardRole for '${id}' invalid`)

  const sm = size === 'xs' || size === 'sm'

  return (
    <BlowCardContentWrapper size={size} center={role.common}>
      {!role.common && (
        <BlowCardTitle
          className="mb-1"
          size={size}
          cards={!sm ? currentCards : 0}
        >
          {role.name}
        </BlowCardTitle>
      )}

      {!role.common && (
        <div className={cx(!sm && 'hidden xs:block', 'flex-1')}></div>
      )}

      <div
        className={cx(
          sm ? 'space-y-0.5' : 'space-y-0.5 xs:space-y-1.5',
          role.common && 'flex flex-col justify-between h-full'
        )}
      >
        {role.actions.map((a) => (
          <BlowActionButton
            key={a}
            id={a}
            size={size}
            state={
              // If we're fetching, set clickable actions to normal
              fetching && fetching !== a && actions[a] === 'clickable'
                ? 'normal'
                : actions[a]
            }
            fetching={fetching === a}
            onClick={onActionClick}
          />
        ))}

        {!role.common && role.actions.length < 2 && role.hasNoCounters && (
          // Blank space where counter actions usually appear
          <BlowActionButton className="hidden xs:flex" size={size} />
        )}
      </div>
    </BlowCardContentWrapper>
  )
}

type ContentWrapperProps = Omit<Props, 'onActionClick'> & {
  children: ReactNode
  center?: boolean
}

function BlowCardContentWrapper({
  children,
  size = 'sm',
  center = false,
}: ContentWrapperProps) {
  const sm = size === 'xs' || size === 'sm'

  return (
    <div
      className={cx(
        'flex flex-col full',
        center && 'justify-center',
        sm
          ? 'px-0.5 pt-0.5 pb-[3px]'
          : !center
          ? 'px-1.5 pt-0.5 pb-1.5'
          : 'p-1.5',
        sm ? 'bg-cyan-200 dark:bg-cyan-925' : 'bg-cyan-100 dark:bg-cyan-975',
        'font-spaced-narrow text-black dark:text-white',
        'rounded-sm',
        'select-none'
      )}
    >
      {children}
    </div>
  )
}
