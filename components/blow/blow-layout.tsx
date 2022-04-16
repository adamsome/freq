import { getGameTitle } from '../../lib/game'
import {
  BlowMessage,
  BlowPlayerView,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { CommandError } from '../../lib/types/game.types'
import { WithIndex } from '../../lib/types/object.types'
import { cx } from '../../lib/util/dom'
import useWindowSize from '../../lib/util/use-window-size'
import Layout from '../layout/layout'
import BlowBoardCommandArea from './blow-board-command-area'
import BlowBoardContent from './blow-board-content'
import BlowMessagePanel from './blow-message-panel'
import BlowPlayersSheet from './blow-players-sheet'

type Props = {
  loading?: boolean
  showBottomCommandArea: boolean
  messages: WithIndex<BlowMessage>[]
  players?: BlowPlayerView[]
  theme?: BlowThemeID
  room?: string
  onCommandError?: (error: CommandError) => void
}

export default function BlowLayout(props: Props) {
  const {
    loading,
    showBottomCommandArea,
    messages,
    players,
    room,
    theme,
    onCommandError,
  } = props

  const windowSize = useWindowSize()
  const messagePanelHeight = getMessagePanelHeight(windowSize)

  const roomUrl = room && `${process.env.NEXT_PUBLIC_BASE_URL}/blow/${room}`

  return (
    <Layout
      type="blow"
      title={getGameTitle('blow')}
      room={room}
      className="bg-white text-black dark:bg-black dark:text-white"
      contentClassName={
        theme !== 'classic'
          ? '[--freq-button-weight:600]'
          : '[--freq-button-weight:400]'
      }
      button={{
        color: 'cyan',
        className: 'inline-flex font-spaced-narrow font-light',
      }}
      sticky
      flexWrapper={false}
    >
      <BlowMessagePanel
        style={{ height: `${messagePanelHeight}px` }}
        className="sticky top-12 z-20"
        loading={loading}
        roomUrl={roomUrl}
        messages={messages}
        players={players}
        theme={theme}
      />

      <div
        className={cx(`
          mx-auto w-full
          max-w-screen-md
          space-y-1.5 pt-1.5
          xs:space-y-2 xs:pt-2
          sm:space-y-4 sm:pt-4
          md:px-2
        `)}
      >
        <BlowBoardContent onCommandError={onCommandError} />

        {showBottomCommandArea && (
          <BlowBoardCommandArea
            position="bottom"
            onCommandError={onCommandError}
          />
        )}

        {/* Empty space, height of player seats bottom sheet, for scrolling */}
        <div className={cx('h-[11.75rem] w-full')}></div>
      </div>

      <BlowPlayersSheet onCommandError={onCommandError} />
    </Layout>
  )
}

interface Size {
  width: number
  height: number
}

/**
 * Calculate height of message panel by taking window height and subtracting
 * the height of the non-message panel components:
 *
 * ```markdown
 * | Resolution:        | xxs (<384)  | xs (<640)   | sm (<768)   |
 * | ------------------ | ----------- | ----------- | ----------- |
 * | Header             |  48px       |  48px       |  48px       |
 * | Common Actions     |  49px       |  51px       |  51px       |
 * | Role Actions (x3)  | 210px       | 237px       | 237px       |
 * | Padding/Gaps (x5)  |  30px       |  40px       |  80px       |
 * | Bottom Spacer      | 188px       | 188px       | 188px       |
 * | ------------------ | ----------- | ----------- | ----------- |
 * | Total              | 525px       | 564px       | 604px       |
 * ```
 */
function getMessagePanelHeight(window: Size): number {
  let otherHeight: number
  if (window.width < 384) {
    otherHeight = 525
  } else if (window.width < 640) {
    otherHeight = 564
  } else {
    otherHeight = 604
  }
  return Math.min(Math.max(window.height - otherHeight, 64), 200)
}
