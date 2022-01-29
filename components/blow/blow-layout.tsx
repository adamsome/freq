import { getGameTitle } from '../../lib/game'
import {
  BlowMessage,
  BlowPlayerView,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { CommandError } from '../../lib/types/game.types'
import { WithIndex } from '../../lib/types/object.types'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import Layout from '../layout/layout'
import BlowBoardCommandArea from './blow-board-command-area'
import BlowBoardContent from './blow-board-content'
import BlowMessagePanel from './blow-message-panel'
import BlowPlayersSheet from './blow-players-sheet'

type Props = {
  messages: WithIndex<BlowMessage>[]
  players?: BlowPlayerView[]
  theme?: BlowThemeID
  room?: string
  onCommandError?: (error: CommandError) => void
}

export default function BlowLayout(props: Props) {
  const { messages, players, room, theme, onCommandError } = props

  const { game } = useBlowGame()

  const showBottomCommandArea =
    theme !== 'magic' ||
    (game?.challenge && game.challenge.winner != null) ||
    (game?.drawCards && game.drawCards.selected) ||
    game?.pickLossCard ||
    game?.winner

  const roomUrl = room && `${process.env.NEXT_PUBLIC_BASE_URL}/blow/${room}`

  return (
    <Layout
      type="blow"
      title={getGameTitle('blow')}
      room={room}
      button={{
        color: 'cyan',
        className: 'inline-flex font-spaced-narrow font-light',
      }}
      sticky
      flexWrapper={false}
    >
      <BlowMessagePanel
        className="sticky top-12 z-20 h-16 md:h-20"
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
          theme === 'magic'
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
        <div className={cx('w-full h-56')}></div>
      </div>

      <BlowPlayersSheet onCommandError={onCommandError} />
    </Layout>
  )
}
