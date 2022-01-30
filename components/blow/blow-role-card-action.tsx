import invariant from 'tiny-invariant'
import {
  getBlowRoleAction,
  isBlowRoleActionDef,
} from '../../lib/blow/blow-role-action-defs'
import { BlowRoleActionDef, BlowThemeID } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowLabel from './tokens/blow-label'
import BlowRoleCardActionIcon from './blow-role-card-action-icon'
import { BlowRoleViewActionClasses } from './blow-role-card-view'

type Props = {
  className?: string
  sizeClassName?: string
  action?: BlowRoleActionDef
  theme?: BlowThemeID
  classes: BlowRoleViewActionClasses
}

export default function BlowRoleCardAction(props: Props) {
  const { className, sizeClassName = 'text-sm', action, theme, classes } = props
  const heightCx = 'h-5 min-h-5'

  if (!action || !theme) {
    return <div className={cx(heightCx, className)}></div>
  }

  let counter: BlowRoleActionDef | undefined
  if (action.counter) {
    counter = getBlowRoleAction(theme, action.counter)
    invariant(
      isBlowRoleActionDef(counter),
      `BlowActionButton: BlowActionDef counter for '${action.counter}' invalid`
    )
  }

  const label = counter
    ? action?.counterLabel ?? counter?.name ?? action.label
    : action.label

  return (
    <div
      className={cx(
        `flex-center group relative w-full py-0
        align-baseline tracking-normal transition`,
        sizeClassName,
        heightCx,
        classes.text,
        className
      )}
    >
      {(counter || action.coins != null) && (
        <div
          className={cx('flex self-baseline', {
            'w-5': action.coins != null,
            'w-4': counter,
          })}
        >
          <BlowRoleCardActionIcon
            action={action}
            counter={counter}
            classes={classes}
          />
        </div>
      )}

      <div className={cx('text-overflow flex-1 text-left leading-tight')}>
        <BlowLabel
          className={cx(counter && 'text-overflow font-semibold')}
          label={label}
          theme={theme}
          coinProps={{
            color: classes.coinColor as string,
            size: 'md',
          }}
        />
      </div>
    </div>
  )
}
