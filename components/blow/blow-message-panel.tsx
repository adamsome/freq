import { useEffect, useRef } from 'react'
import {
  BlowMessage,
  BlowPlayerView,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { WithIndex } from '../../lib/types/object.types'
import { cx } from '../../lib/util/dom'
import GameLink from '../game-link'
import BlowMessageCurrent from './blow-message-current'
import BlowMessageLine from './blow-message-line'

type Props = {
  className?: string
  roomUrl?: string
  messages?: WithIndex<BlowMessage>[]
  players?: BlowPlayerView[]
  theme?: BlowThemeID
}

export default function BlowMessagePanel(props: Props) {
  const { className = '', roomUrl, messages = [], players, theme } = props

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    ref?.current?.scroll({ top: ref.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const hasMessages = messages.length > 0 && theme != null

  return (
    <div
      className={cx(
        'flex flex-col w-full px-0 py-0',
        'relative overflow-hidden',
        'border-b border-gray-100 dark:border-gray-950',
        className
      )}
    >
      <div
        ref={ref}
        className={cx(
          'flex-1 full max-h-full overflow-scroll-fix',
          'm-auto pt-2 pb-1',
          'text-sm text-gray-500'
        )}
      >
        <GameLink
          className="mt-1"
          url={roomUrl}
          button={{ color: 'cyan', bgHover: false }}
        />

        {hasMessages && (
          <div className={cx('w-full my-2 px-4')}>
            <div
              className={cx('w-full h-px', 'bg-gray-100 dark:bg-gray-900')}
            ></div>
          </div>
        )}

        {hasMessages && (
          <div
            className={cx('block max-w-sm m-auto px-5 space-y-1 font-narrow')}
          >
            {messages.map((msg) => (
              <BlowMessageLine key={msg.i} players={players} theme={theme}>
                {msg}
              </BlowMessageLine>
            ))}

            <div>
              <BlowMessageCurrent
                theme={theme}
                onChange={() =>
                  ref?.current?.scroll({
                    top: ref.current.scrollHeight,
                    behavior: 'smooth',
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      {hasMessages && (
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
