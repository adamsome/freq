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
        'relative align-baseline flex-center group transition',
        'w-full py-0',
        sizeClassName,
        heightCx,
        'tracking-normal',
        classes.text,
        className
      )}
    >
      {action.coins != null && (
        <div className={cx('flex self-baseline w-[19px]')}>
          <BlowRoleCardActionIcon
            action={action}
            counter={counter}
            classes={classes}
          />
        </div>
      )}

      <div className={cx('flex-1 text-left leading-tight text-overflow')}>
        <BlowLabel
          className={cx(counter && 'font-semibold text-overflow')}
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
