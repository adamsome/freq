import {
  BlowMessage,
  BlowPlayerView,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowLabel from './blow-label'

type Props = {
  children: BlowMessage
  players?: BlowPlayerView[]
  theme: BlowThemeID
}

export default function BlowMessageLine(props: Props) {
  const { children: msg, ...rest } = props
  return (
    <div className={cx({ 'text-red-500': msg.error })}>
      <BlowLabel label={msg.text} {...rest} />
    </div>
  )
}
