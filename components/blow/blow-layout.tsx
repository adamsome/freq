import { getGameTitle } from '../../lib/game'
import { BlowMessage, BlowPlayerView } from '../../lib/types/blow.types'
import { CommandError } from '../../lib/types/game.types'
import { WithIndex } from '../../lib/types/object.types'
import { cx } from '../../lib/util/dom'
import Layout from '../layout/layout'
import LayoutMain from '../layout/layout-main'
import BlowBoardLayout from './blow-board-layout'
import BlowMessagePanel from './blow-message-panel'
import BlowPlayersSheet from './blow-players-sheet'

type Props = {
  messages: WithIndex<BlowMessage>[]
  players?: BlowPlayerView[]
  room?: string
  onCommandError?: (error: CommandError) => void
}

export default function BlowLayout(props: Props) {
  const { messages, players, room, onCommandError } = props

  const roomUrl = room && `${process.env.NEXT_PUBLIC_BASE_URL}/blow/${room}`

  return (
    <Layout
      className="[--freq-button-weight:400]"
      type="blow"
      title={getGameTitle('blow')}
      room={room}
      button={{
        color: 'cyan',
        className: 'inline-flex font-spaced-narrow font-light',
      }}
    >
      <LayoutMain paddingClass="md:px-2">
        <BlowMessagePanel
          className="h-16 md:h-20"
          roomUrl={roomUrl}
          messages={messages}
          players={players}
        />
        <div
          className={cx(
            'w-full flex justify-center',
            'overflow-auto',
            // Explicitly set height to full window minus the header & messages
            // panel to allow the board to scroll past the players sheet
            'max-h-[calc(100vh-theme(spacing.12)-theme(spacing.16))]',
            'md:max-h-[calc(100vh-theme(spacing.12)-theme(spacing.20))]'
          )}
        >
          <BlowBoardLayout
            className="full pt-2 xs:pt-3 sm:pt-4"
            // Height of the players sheet's seat grid + chrome
            bottomSpacerClass="min-h-[theme(spacing.48)]"
            onCommandError={onCommandError}
          />
        </div>

        <BlowPlayersSheet onCommandError={onCommandError} />
      </LayoutMain>
    </Layout>
  )
}
