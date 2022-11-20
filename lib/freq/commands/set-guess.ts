import { CurrentFreqGameView } from '../../types/freq.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../freq-game-store'

export default async function setGuess(
  game: CurrentFreqGameView,
  guess: unknown
) {
  const player = game.currentPlayer
  const isPlayerTurn = player?.team === game.team_turn
  if (game.psychic === player.id || !isPlayerTurn)
    throw new Error('Only non-psychic players on turn team can set guess.')

  if (game.phase !== 'guess')
    throw new Error('Can only set guess in the guess phase.')

  if (player && game.guesses?.[player.id]?.locked)
    throw new Error('Cannot set guess once its locked.')

  if (typeof guess !== 'number')
    throw new TypeError("Command 'set_guess' requires numeric 'guess'.")

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await fromGames(db).updateOne(filter, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $set: { [`guesses.${player.id}.value`]: guess } as any,
  })
}
