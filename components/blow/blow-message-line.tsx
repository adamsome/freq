import { BlowMessage } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'

type Props = {
  children: BlowMessage
  subject?: string
}

export default function BlowMessageLine({ children: msg, subject }: Props) {
  return (
    <div className={cx({ 'text-red-500': msg.error })}>
      {subject && (
        <>
          <span className="font-spaced-narrow font-semibold">{subject}</span>
          {': '}
        </>
      )}
      {msg.text}
    </div>
  )
}
