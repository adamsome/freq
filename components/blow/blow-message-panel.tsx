import type { HTMLAttributes } from 'react'
import { useEffect, useRef } from 'react'
import {
  BlowMessage,
  BlowPlayerView,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { WithIndex } from '../../lib/types/object.types'
import { cx } from '../../lib/util/dom'
import GameLink from '../game-link'
import SkeletonBox from '../layout/skeleton-box'
import BlowMessageCurrent from './blow-message-current'
import BlowMessageLine from './blow-message-line'

type Props = HTMLAttributes<HTMLDivElement> & {
  loading?: boolean
  roomUrl?: string
  messages?: WithIndex<BlowMessage>[]
  players?: BlowPlayerView[]
  theme?: BlowThemeID
}

export default function BlowMessagePanel(props: Props) {
  const {
    className,
    loading,
    roomUrl,
    messages = [],
    players,
    theme,
    ...divProps
  } = props

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    ref?.current?.scroll({ top: ref.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const hasMessages = messages.length > 0 && theme != null

  if (loading) return <SkeletonBox className={cx(className)} rounded={false} />

  return (
    <div
      {...divProps}
      className={cx(`
        relative w-full
        border-b border-black/20
        bg-white/50
        p-0
        backdrop-blur-[10px]
        dark:border-white/20 dark:bg-black/50
        ${className}
      `)}
      data-body-scroll-lock-ignore
    >
      <div
        ref={ref}
        className={cx(`
          full m-auto block max-h-full
          overflow-y-auto pt-2 pb-1
          text-sm text-gray-500
        `)}
      >
        <GameLink
          className="mt-1"
          url={roomUrl}
          button={{ color: 'cyan', bgHover: false }}
        />

        {hasMessages && (
          <div className="my-2 w-full px-4">
            <div className="h-px w-full bg-black/10 dark:bg-white/10"></div>
          </div>
        )}

        {hasMessages && (
          <div className="m-auto block max-w-screen-md space-y-1 px-5 font-narrow">
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
          className={cx(`
            pointer-events-none
            absolute top-0 left-0 right-3.5
            h-6
            bg-gradient-to-b
            from-white dark:from-black
            md:h-8
          `)}
        ></div>
      )}
    </div>
  )
}
