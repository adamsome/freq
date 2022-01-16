import { useEffect, useRef } from 'react'
import { BlowMessage, BlowPlayerView } from '../../lib/types/blow.types'
import { WithIndex } from '../../lib/types/object.types'
import { cx } from '../../lib/util/dom'
import GameLink from '../game-link'
import BlowMessageLine from './blow-message-line'

type Props = {
  className?: string
  roomUrl?: string
  messages?: WithIndex<BlowMessage>[]
  players?: BlowPlayerView[]
}

export default function BlowMessagePanel({
  className = '',
  roomUrl,
  messages = [],
  players,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    ref?.current?.scroll({ top: ref.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

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
        <GameLink
          className="mt-1"
          url={roomUrl}
          button={{ color: 'cyan', bgHover: false }}
        />

        {messages.length > 0 && (
          <div className={cx('w-full', 'my-2 px-4')}>
            <div
              className={cx('w-full h-px', 'bg-gray-100 dark:bg-gray-900')}
            ></div>
          </div>
        )}

        {messages.length > 0 && (
          <div className={cx('max-w-sm m-auto px-5 space-y-1.5')}>
            {messages.map((msg) => (
              <BlowMessageLine key={msg.index} subject={getSubject(msg)}>
                {msg}
              </BlowMessageLine>
            ))}
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div
          className={cx(
            'absolute top-0 left-0 right-3.5',
            'pointer-events-none',
            'h-6 md:h-8',
            'from-white dark:from-black bg-gradient-to-b '
          )}
        ></div>
      )}
    </div>
  )
}
