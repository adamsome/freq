import { useEffect, useRef } from 'react'
import { BlowMessage, BlowPlayerView } from '../../lib/types/blow.types'
import { WithIndex } from '../../lib/types/object.types'
import { createPropComparer } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import GameLink from '../game-link'
import BlowMessageLine from './blow-message-line'

type Props = {
  className?: string
  roomUrl?: string
  messages?: BlowMessage[]
  errors: WithIndex<BlowMessage>[]
  players?: BlowPlayerView[]
}

const indexComparer = createPropComparer((m: WithIndex<unknown>) => m.index)

export default function BlowMessagePanel({
  className = '',
  roomUrl,
  messages = [],
  errors,
  players,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref) {
      ref.current?.scroll({ top: ref.current.scrollHeight, behavior: 'smooth' })
    }
    return
  }, [messages.length, errors.length])

  const allMessages = [
    ...messages.map((m, index) => ({ ...m, index })),
    ...errors,
  ].sort(indexComparer)

  const getSubject = (msg: BlowMessage) =>
    msg.subject === '__dealer'
      ? 'Dealer'
      : typeof msg.subject === 'number'
      ? players?.[msg.subject]?.name
      : players?.find((p) => p.id === msg.subject)?.name ?? msg.subject

  return (
    <div
      className={cx(
        'w-full px-0 py-0',
        'relative overflow-hidden',
        'border-b border-gray-100 dark:border-gray-950',
        className
      )}
    >
      <div
        ref={ref}
        className={cx(
          'full max-h-full overflow-auto',
          'm-auto py-2',
          'text-sm text-gray-500'
        )}
      >
        <GameLink url={roomUrl} button={{ color: 'cyan', bgHover: false }} />
        {allMessages.length && (
          <div className={cx('w-full', 'my-2 px-4')}>
            <div
              className={cx('w-full h-px', 'bg-gray-100 dark:bg-gray-900')}
            ></div>
          </div>
        )}

        {allMessages.length && (
          <div className={cx('max-w-sm m-auto px-5 space-y-1.5')}>
            {allMessages.map((msg) => (
              <BlowMessageLine key={msg.index} subject={getSubject(msg)}>
                {msg}
              </BlowMessageLine>
            ))}
          </div>
        )}
      </div>

      <div
        className={cx(
          'absolute top-0 left-0 right-3.5',
          'pointer-events-none',
          'h-6 md:h-8',
          'from-white dark:from-black bg-gradient-to-b '
        )}
      ></div>
    </div>
  )
}
