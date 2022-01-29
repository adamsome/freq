import { BlowRoleActionDef } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import IconSvg from '../control/icon-svg'
import BlowCoin from './tokens/blow-coin'
import { BlowRoleViewActionClasses } from './blow-role-card-view'

type Props = {
  action?: BlowRoleActionDef
  counter?: BlowRoleActionDef
  classes: BlowRoleViewActionClasses
}

export default function BlowRoleCardActionIcon({
  action,
  counter,
  classes,
}: Props) {
  if (action?.coins) {
    return (
      <BlowCoin
        className="mt-px"
        lit
        color={classes.coinColor as string}
        size="md"
        showIndividualCoins={false}
      >
        {action.coins}
      </BlowCoin>
    )
  }

  if (counter) {
    return (
      <IconSvg
        className={cx(
          classes.icon,
          'relative transition-all',
          'w-3 h-5 ml-0.5'
        )}
        name="shield"
        top="-2px"
      />
    )
  }

  return null
}