import { useState } from 'react'
import { getGameTitle } from '../../lib/game'
import { BlowMessage } from '../../lib/types/blow.types'
import { CommandError } from '../../lib/types/game.types'
import { WithIndex } from '../../lib/types/object.types'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import Layout from '../layout/layout'
import LayoutMain from '../layout/layout-main'
import BlowMessagePanel from './blow-message-panel'
import BlowPlayersSheet from './blow-players-sheet'
import BlowGameBoard from './blow-game-board'

export default function BlowLayout() {
  const { game } = useBlowGame()
  const [errors, setErrors] = useState<WithIndex<BlowMessage>[]>([])

  const roomUrl =
    game?.type &&
    `${process.env.NEXT_PUBLIC_BASE_URL}/${game.type}/${game.room}`

  const handleError = (e: CommandError): void => {
    const msgCount = game?.messages?.length ?? 0
    const prevMsgIndex = msgCount > 0 ? msgCount - 1 : 0
    const prevErrIndex = errors.length ? errors[errors.length - 1].index : 0
    const index = Math.max(prevMsgIndex, prevErrIndex) + 0.1
    const date = e.date.toISOString()
    const text = e.message
    setErrors([...errors, { date, text, index, error: true }])
  }

  return (
    <Layout
      className="[--freq-button-weight:400]"
      type="blow"
      title={getGameTitle('blow')}
      room={game?.room}
      button={{
        color: 'cyan',
        className: 'inline-flex font-spaced-narrow font-light',
      }}
    >
      <LayoutMain paddingClass="md:px-2">
        <BlowMessagePanel
          className="h-16 md:h-20"
          roomUrl={roomUrl}
          messages={game?.messages}
          errors={errors}
          players={game?.players}
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
          <BlowGameBoard
            className="full pt-2 xs:pt-3 sm:pt-4"
            // Height of the players sheet's seat grid + chrome
            bottomSpacerClass="min-h-[theme(spacing.48)]"
            onError={handleError}
          />
        </div>

        <BlowPlayersSheet />
      </LayoutMain>
    </Layout>
  )
}
