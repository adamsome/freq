import { CurrentFreqGameView } from '../../types/freq.types'
import { connectToDatabase } from '../../util/mongodb'
import { fetchCurrentFreqGameView, fromGames } from '../freq-game-store'
import { areAllDirectionGuessesLocked } from '../guess-direction'
import revealRoundResults from './reveal-round-results'

export default async function lockDirection(game: CurrentFreqGameView) {
  const player = game.currentPlayer

  if (player.team === game.team_turn)
    throw new Error('Only players not on turn team can lock direction.')

  if (game.phase !== 'direction')
    throw new Error('Can only lock direction in the direction phase.')

  if (game.directions?.[player.id]?.value == null)
    throw new Error('Can only lock direction once one is made.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await fromGames(db).updateOne(filter, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $set: { [`directions.${player.id}.locked`]: true } as any,
  })

  const updatedGame = await fetchCurrentFreqGameView(game.room, player.id)

  if (areAllDirectionGuessesLocked(updatedGame))
    await revealRoundResults(updatedGame)
}
