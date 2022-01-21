import { BlowMessage, BlowPlayerView } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowLabel from './blow-label'

type Props = {
  children: BlowMessage
  players?: BlowPlayerView[]
}

export default function BlowMessageLine({ children: msg, players }: Props) {
  return (
    <div className={cx({ 'text-red-500': msg.error })}>
      <BlowLabel label={msg.text} players={players} />
    </div>
  )
}
