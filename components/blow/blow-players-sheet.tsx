import { useState } from 'react'
import { Drawer } from 'vaul'
import { CommandError } from '../../lib/types/game.types'
import useSize from '../../lib/util/use-size'
import useWindowSize from '../../lib/util/use-window-size'
import BlowPlayerSeatsContainer from './blow-player-seats-container'

type Props = {
  onCommandError?: (error: CommandError) => void
}

/** Height of the peek snap point: just the drag handle. */
const PEEK_HEIGHT = 32

/**
 * Always-open, non-blocking bottom sheet of player seats. Snaps to a peek of
 * the handle, the seats' natural height (default), 60% and 90% of the window.
 */
export default function BlowPlayersSheet({ onCommandError }: Props) {
  // Callback ref: the drawer content mounts in a portal after first render.
  const [body, setBody] = useState<HTMLDivElement | null>(null)
  const [, bodyHeight] = useSize(body)
  const { height: windowHeight } = useWindowSize()

  const contentHeight = bodyHeight > 0 ? PEEK_HEIGHT + bodyHeight : 0
  const snapPoints = [
    ...new Set(
      [
        PEEK_HEIGHT,
        contentHeight,
        Math.round(windowHeight * 0.6),
        Math.round(windowHeight * 0.9),
      ].filter((h) => h >= PEEK_HEIGHT && Number.isFinite(h))
    ),
  ]
    .sort((a, b) => a - b)
    .map((h) => `${h}px`)

  const [snap, setSnap] = useState<number | string | null>(null)
  // Start at the content height once it's measured.
  if (snap === null && contentHeight > 0) {
    setSnap(`${contentHeight}px`)
  }

  return (
    <Drawer.Root
      open
      modal={false}
      dismissible={false}
      noBodyStyles
      disablePreventScroll
      snapPoints={snapPoints}
      activeSnapPoint={snap ?? `${PEEK_HEIGHT}px`}
      setActiveSnapPoint={setSnap}
    >
      <Drawer.Portal>
        <Drawer.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed inset-x-0 bottom-0 z-30 flex h-dvh flex-col bg-white shadow-[0_-5px_60px_0_rgb(38_89_115/11%),0_-1px_0_rgb(38_89_115/5%)] outline-none dark:bg-gray-900"
        >
          <Drawer.Title className="sr-only">Players</Drawer.Title>
          <div className="flex h-8 flex-shrink-0 justify-center pt-2">
            <Drawer.Handle
              // A tap shouldn't jump between snap points (the old sheet didn't).
              preventCycle
              className="!m-0 !h-1 !w-9 !bg-black/15 dark:!bg-white/15"
            />
          </div>
          <div ref={setBody} className="flex-center overflow-hidden px-2 pb-2">
            <BlowPlayerSeatsContainer onCommandError={onCommandError} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
