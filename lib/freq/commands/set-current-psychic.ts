import { isPlayer } from '../../player'
import { CurrentFreqGameView } from '../../types/freq.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../freq-game-store'
import { getPsychic } from '../freq-psychic'

export default async function (game: CurrentFreqGameView, player: unknown) {
  if (!isPlayer(player)) {
    const msg = "Command 'set-current-psychic' requires valid 'player'."
    throw new TypeError(msg)
  }

  const isPrepAndDesignated =
    game.settings?.designated_psychic && game.phase === 'prep'

  if (game.phase !== 'choose' && !isPrepAndDesignated)
    throw new Error('Can only change the psychic in the choose phase.')

  if (player.team !== getPsychic(game)?.team && !isPrepAndDesignated)
    throw new Error('Can only change psychic within same team during game')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await fromGames(db).updateOne(filter, {
    $set: {
      psychic: player.id,
    },
  })
}
