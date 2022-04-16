import {
  BlowMessage,
  BlowPlayerView,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowLabel from './tokens/blow-label'

type Props = {
  children: BlowMessage
  players?: BlowPlayerView[]
  theme: BlowThemeID
}

export default function BlowMessageLine(props: Props) {
  const { children: msg, ...rest } = props
  return (
    <div className={cx({ 'text-red-500': msg.error })}>
      {msg.line ? (
        <hr className="mt-1.5 border-black/10 dark:border-white/10" />
      ) : (
        <BlowLabel label={msg.text} {...rest} />
      )}
    </div>
  )
}
