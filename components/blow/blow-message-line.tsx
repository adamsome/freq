import { BlowMessage } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowPlayerLabel from './blow-player-label'

type Props = {
  children: BlowMessage
  subject?: string
}

export default function BlowMessageLine({ children: msg, subject }: Props) {
  return (
    <div className={cx({ 'text-red-500': msg.error })}>
      {subject && (
        <>
          <BlowPlayerLabel>{subject}</BlowPlayerLabel>
          {': '}
        </>
      )}
      {msg.text}
    </div>
  )
}
