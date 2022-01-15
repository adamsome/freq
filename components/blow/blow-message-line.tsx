import { BlowMessage } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowLabel, { BlowLabelItem } from './blow-label'

type Props = {
  children: BlowMessage
  subject?: string
}

export default function BlowMessageLine({ children: msg, subject }: Props) {
  const label: string | BlowLabelItem[] = subject
    ? [{ type: 'player', value: subject }, msg.text]
    : [msg.text]
  return (
    <div className={cx({ 'text-red-500': msg.error })}>
      <BlowLabel label={label} />
    </div>
  )
}
