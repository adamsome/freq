import { getGameTitle } from '../../lib/game'
import {
  BlowMessage,
  BlowPlayerView,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { CommandError } from '../../lib/types/game.types'
import { WithIndex } from '../../lib/types/object.types'
import { cx } from '../../lib/util/dom'
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

  const roomUrl = room && `${process.env.NEXT_PUBLIC_BASE_URL}/blow/${room}`

  return (
    <Layout
      type="blow"
      title={getGameTitle('blow')}
      room={room}
      className="bg-white dark:bg-black text-black dark:text-white"
      button={{
        color: 'cyan',
        className: 'inline-flex font-spaced-narrow font-light',
      }}
      sticky
      flexWrapper={false}
    >
      <BlowMessagePanel
        className="sticky top-12 z-20 h-16 md:h-20"
        loading={loading}
        roomUrl={roomUrl}
        messages={messages}
        players={players}
        theme={theme}
      />

      <div
        className={cx(
          'w-full max-w-screen-md',
          'mx-auto pt-1.5 xs:pt-2 sm:pt-4 md:px-2',
          'space-y-1.5 xs:space-y-2 sm:space-y-4',
          theme !== 'classic'
            ? '[--freq-button-weight:600]'
            : '[--freq-button-weight:400]'
        )}
      >
        <BlowBoardContent onCommandError={onCommandError} />

        {showBottomCommandArea && (
          <BlowBoardCommandArea
            position="bottom"
            onCommandError={onCommandError}
          />
        )}

        {/* Empty space, height of player seats bottom sheet, for scrolling */}
        <div className={cx('w-full h-[11.75rem]')}></div>
      </div>

      <BlowPlayersSheet onCommandError={onCommandError} />
    </Layout>
  )
}
