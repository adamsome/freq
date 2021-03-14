import { CurrentGameView } from '../../types/game.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../game-store'

export default async function (game: CurrentGameView, guess: unknown) {
  const player = game.currentPlayer
  const isPlayerTurn = player?.team === game.team_turn
  if (game.psychic === player.id || !isPlayerTurn)
    throw new Error('Only non-psychic players on turn team can set guess.')

  if (game.phase !== 'guess')
    throw new Error('Can only lock guess in the guess phase.')

  if (player && game.guesses?.[player.id]?.locked)
    throw new Error('Cannot set guess once its locked.')

  if (typeof guess !== 'number')
    throw new TypeError("Command 'set_guess' requires numeric 'guess'.")

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await fromGames(db).updateOne(filter, {
    $set: { [`guesses.${player.id}.value`]: guess },
  })
}
