import invariant from 'tiny-invariant'
import { isBlowRoleDef } from '../../lib/blow/blow-role-defs'
import {
  BlowActionState,
  BlowPhase,
  BlowRoleActionID,
  BlowRoleID,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import SkeletonBox from '../layout/skeleton-box'
import BlowCardTitle from './blow-card-title'
import BlowRoleCardAction from './blow-role-card-action'
import BlowRoleCardButton from './blow-role-card-button'
import getBlowRoleView from './blow-role-card-view'
import BlowRoleIcon from './icons/blow-role-icon'

type Props = {
  id?: BlowRoleID | null
  index?: number
  actions?: Partial<Record<BlowRoleActionID, BlowActionState>>
  currentCards?: number
  theme?: BlowThemeID
  phase?: BlowPhase
  fetching?: BlowRoleActionID | null
  onActionClick?: (id: BlowRoleActionID) => void
}

export type BlowRoleCardProps = Props

export default function BlowRoleCard(props: Props) {
  return (
    <BlowRoleCardButton {...props}>
      <BlowRoleCardContent {...props} />
    </BlowRoleCardButton>
  )
}

function BlowRoleCardContent(props: Props) {
  const { id, theme, actions = {}, currentCards = 0, phase } = props

  if (!id || !theme)
    return (
      <SkeletonBox
        className="h-[4.85rem] w-full"
        roundedClassName="rounded-md"
      />
    )

  const view = getBlowRoleView(theme, id, actions, {
    clickable: phase === 'prep',
  })
  const { role, active, counter, classes } = view
  invariant(isBlowRoleDef(role), `BlowRoleCard: Role for '${id}' invalid`)

  return (
    <div className="relative flex w-full items-start justify-start">
      <BlowRoleIcon
        className={cx(
          classes.roleIcon,
          'ml-1 mr-2 w-12 flex-shrink-0 xs:ml-1.5 xs:mr-2.5'
        )}
        role={id}
      />

      <div className="flex-1 overflow-hidden">
        {!role.common && (
          <BlowCardTitle
            className={cx(classes.title, '-mb-0.5 xs:mb-px')}
            {...props}
            currentCards={currentCards}
            theme={theme}
          >
            {role.name}
          </BlowCardTitle>
        )}

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

        <div
          className={cx(
            'mt-0.5 mb-px mr-1 h-px border-t border-b-0 border-l-0 border-r-0 xs:my-1 xs:mb-0.5',
            view.classes.separator
          )}
        ></div>

        {counter ? (
          <>
            <BlowRoleCardAction
              sizeClassName="text-xs xs:text-sm"
              action={counter}
              theme={theme}
              classes={view.classes.counter}
            />
          </>
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
      </div>
    </div>
  )
}
