import { ResGame } from '../../types/res.types'
import { connectToDatabase } from '../../util/mongodb'
import { shuffle } from '../../util/random'
import { fromResGames } from '../res-game-store'

export default async function shuffleTeams(game: ResGame) {
  if (game.phase !== 'prep') throw new Error('Can only shuffle teams in prep.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const player_order = shuffle(game.player_order)

  await fromResGames(db).updateOne(filter, {
    $set: {
      player_order,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [`rounds.${0}.lead`]: player_order[0] as any,
    },
  })
}
