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
  currentCard?: boolean
}

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
  currentCard,
}: Props) {
  if (variant === 'empty') return null

  if (variant === 'facedown') return <BlowCardFacedownPattern color={color} />

  if (!id) return <SkeletonBox color="cyan" className="full" />

  const role = BLOW_ROLE_DEFS[id]
  invariant(isBlowRoleDef(role), `BlowCard: BlowCardRole for '${id}' invalid`)

  const sm = size === 'xs' || size === 'sm'

  return (
    <BlowCardContentWrapper size={size}>
      {!role.common && (
        <BlowCardTitle size={size} showCard={!sm && currentCard}>
          {role.name}
        </BlowCardTitle>
      )}

      <div className="flex-1"></div>

      <div className={sm ? 'space-y-0.5' : 'space-y-1.5'}>
        {role.actions.map((a) => (
          <BlowActionButton key={a} id={a} size={size} state={actions[a]} />
        ))}

        {!role.common && role.actions.length < 2 && role.hasNoCounters && (
          // Blank space where counter actions usually appear
          <BlowActionButton size={size} />
        )}
      </div>
    </BlowCardContentWrapper>
  )
}

function BlowCardContentWrapper({
  children,
  size = 'sm',
}: Props & { children: ReactNode }) {
  const sm = size === 'xs' || size === 'sm'

  return (
    <div
      className={cx(
        'flex flex-col full',
        sm ? 'px-0.5 pt-0.5 pb-[3px]' : 'px-1.5 pt-0.5 pb-1.5',
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
