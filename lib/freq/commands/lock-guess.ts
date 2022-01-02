import { CurrentFreqGameView } from '../../types/freq.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../freq-game-store'
import { areAllNeedleGuessesLocked } from '../guess-needle'

export default async function (game: CurrentFreqGameView) {
  const player = game.currentPlayer
  const isPlayerTurn = player.team === game.team_turn
  if (game.psychic === player.id || !isPlayerTurn)
    throw new Error('Only non-psychic players on turn team can lock guess.')

  if (game.phase !== 'guess')
    throw new Error('Can only lock guess in the guess phase.')

  if (game.guesses?.[player.id]?.value == null)
    throw new Error('Can only lock guess once one is made.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await fromGames(db).updateOne(filter, {
    $set: { [`guesses.${player.id}.locked`]: true },
  })

  if (areAllNeedleGuessesLocked(game, player))
    await fromGames(db).updateOne(filter, { $set: { phase: 'direction' } })
}
