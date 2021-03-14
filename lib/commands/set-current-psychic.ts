import { CurrentGameView } from '../../types/game.types'
import { connectToDatabase } from '../../util/mongodb'
import { getPsychic } from '../game'
import { fromGames } from '../game-store'
import { isPlayer } from '../player'

export default async function (game: CurrentGameView, player: unknown) {
  if (!isPlayer(player)) {
    const msg = "Command 'set-current-psychic' requires valid 'player'."
    throw new TypeError(msg)
  }

  if (game.phase !== 'choose')
    throw new Error('Can only change the psychic in the choose phase.')

  if (player.team !== getPsychic(game)?.team)
    throw new Error('Can only change psychic within same team during game')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await fromGames(db).updateOne(filter, {
    $set: {
      psychic: player.id,
    },
  })
}
