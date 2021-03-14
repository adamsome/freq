import { CurrentGameView } from '../../types/game.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../game-store'

export default async function (game: CurrentGameView, guess: unknown) {
  const player = game.currentPlayer

  if (!player) throw new Error('Player is not a member of the game.')

  if (player.team === game.team_turn)
    throw new Error('Only players not on turn team can set direction.')

  if (game.phase !== 'direction')
    throw new Error('Can only lock direction in the direction phase.')

  if (game.directions?.[player.id]?.locked)
    throw new Error('Cannot set direction once its locked.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await fromGames(db).updateOne(filter, {
    $set: { [`directions.${player.id}.value`]: guess },
  })
}