import { useEffect, useMemo } from 'react'
import { useBlowGame } from '../../lib/util/use-game'
import { useSortedListWithExtras } from '../../lib/util/use-sorted-list-with-extras'
import BlowLayout from './blow-layout'

export default function BlowContainer() {
  const { game } = useBlowGame()
  const { messages: rawMessages = [], players, room, settings } = game ?? {}

  const last = rawMessages[rawMessages.length - 1]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoedMessages = useMemo(() => rawMessages, [rawMessages.length, last])

  const [messages, addError, resetErrors] =
    useSortedListWithExtras(memoedMessages)

  // Clear the errors list when the game phase changes
  const phase = game?.phase ?? 'prep'
  useEffect(() => {
    resetErrors()
  }, [phase, resetErrors])

  const showBottomCommandArea =
    settings?.theme === 'classic' ||
    (game?.challenge && game.challenge.winner != null) ||
    (!game?.turn && game?.drawCards && game.drawCards.selected) ||
    game?.pickLossCard != null ||
    game?.winner != null

  return (
    <BlowLayout
      loading={!game}
      showBottomCommandArea={showBottomCommandArea}
      messages={messages}
      players={players}
      room={room}
      theme={settings?.theme}
      onCommandError={(e) => addError({ text: e.message, i: 0, error: true })}
    />
  )
}
