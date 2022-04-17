import type { ReactNode } from 'react'
import invariant from 'tiny-invariant'
import { isBlowRoleDef } from '../../lib/blow/blow-role-defs'
import {
  BlowActionState,
  BlowCardVariant,
  BlowPhase,
  BlowRoleActionID,
  BlowRoleID,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import IconSvg from '../control/icon-svg'
import SkeletonBox from '../layout/skeleton-box'
import BlowCardTitle from './blow-card-title'
import BlowRoleCardAction from './blow-role-card-action'
import BlowRoleCardButton from './blow-role-card-button'
import getBlowRoleView, { BlowRoleView } from './blow-role-card-view'
import BlowRoleIcon from './icons/blow-role-icon'

type Props = {
  className?: string
  id?: BlowRoleID | null
  index?: number
  actions?: Partial<Record<BlowRoleActionID, BlowActionState>>
  currentCards?: number
  theme?: BlowThemeID
  clickable?: boolean
  disableOpacity?: boolean
  showOnly?: 'active' | 'counter'
  killCount?: number
  phase?: BlowPhase
  variant?: BlowCardVariant
  emptyMessage?: ReactNode
  fetching?: BlowRoleActionID | null
  onActionClick?: (id: BlowRoleActionID) => void
}

export type BlowRoleCardProps = Props

export default function BlowRoleCard(props: Props) {
  const {
    id,
    index,
    theme,
    actions = {},
    phase,
    disableOpacity,
    clickable,
  } = props
  const isCommonRole = id === 'common'
  const view = getBlowRoleView(theme, id, actions, {
    clickable: clickable ?? phase === 'prep',
    useActionIndex: isCommonRole ? index : undefined,
    disableOpacity,
  })
  return (
    <BlowRoleCardButton {...props} view={view}>
      <BlowRoleCardContent {...props} view={view} />
    </BlowRoleCardButton>
  )
}

function BlowRoleCardContent(props: Props & { view: BlowRoleView }) {
  const {
    view,
    id,
    theme,
    currentCards = 0,
    variant,
    emptyMessage,
    showOnly,
    killCount,
  } = props

  if (variant === 'empty') {
    if (emptyMessage) return <>{emptyMessage}</>
    return null
  }

  if (!id || !theme)
    return (
      <SkeletonBox
        className="h-[4.85rem] w-full"
        roundedClassName="rounded-md"
      />
    )

  const { role, active, counter, classes } = view
  invariant(isBlowRoleDef(role), `BlowRoleCard: Role for '${id}' invalid`)

  return (
    <div className="relative flex w-full items-start justify-start">
      <BlowRoleIcon
        className={cx(
          classes.roleIcon,
          'ml-1 mr-2 flex-shrink-0 xs:ml-1.5 xs:mr-2.5',
          showOnly ? 'w-10' : 'w-12'
        )}
        role={id}
      />

      {id !== 'common' && killCount != null && !showOnly && (
        <div
          className={cx(
            'flex-center absolute bottom-0.5 left-1.5 space-x-0.5',
            showOnly ? 'w-10' : 'w-12'
          )}
        >
          {range(0, killCount).map((i) => (
            <IconSvg
              key={i}
              className="h-[16.666px] w-[14.4295px] text-red-500/75"
              name="skull"
              top="0"
            />
          ))}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {!role.common && (
          <BlowCardTitle
            {...props}
            className={cx(classes.title, '-mb-0.5 xs:mb-px')}
            currentCards={currentCards}
            theme={theme}
          >
            {role.name}
          </BlowCardTitle>
        )}

        {showOnly !== 'counter' && (
          <>
            {active ? (
              <BlowRoleCardAction
                action={active}
                theme={theme}
                classes={view.classes.active}
              />
            ) : (
              <div
                className={cx(
                  classes.active.hint,
                  'text-overflow text-left text-sm italic'
                )}
              >
                No Active Spell
              </div>
            )}
          </>
        )}

        {!showOnly && (
          <div
            className={cx(
              'mt-0.5 mb-px mr-1 h-px border-t border-b-0 border-l-0 border-r-0 xs:my-1 xs:mb-0.5',
              view.classes.separator
            )}
          ></div>
        )}

        {showOnly !== 'active' && (
          <>
            {counter ? (
              <BlowRoleCardAction
                sizeClassName="text-xs xs:text-sm"
                action={counter}
                theme={theme}
                classes={view.classes.counter}
              />
            ) : (
              <div
                className={cx(
                  classes.counter.hint,
                  'text-overflow pt-0.5 text-left text-xs italic xs:pt-px xs:text-sm'
                )}
              >
                No Counter Spell
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
