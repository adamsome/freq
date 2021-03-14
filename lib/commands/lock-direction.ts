import { CurrentGameView } from '../../types/game.types'
import { connectToDatabase } from '../../util/mongodb'
import { fetchCurrentGameView, fromGames } from '../game-store'
import { areAllDirectionGuessesLocked } from '../guess'
import revealRoundResults from './reveal-round-results'

export default async function (game: CurrentGameView) {
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
    $set: { [`directions.${player.id}.locked`]: true },
  })

  const updatedGame = await fetchCurrentGameView(game.room, player.id)

  if (areAllDirectionGuessesLocked(updatedGame))
    await revealRoundResults(updatedGame)
}
