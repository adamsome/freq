import { isPlayer } from '../../player'
import { CurrentFreqGameView } from '../../types/freq.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../freq-game-store'
import { getNextPsychic } from '../freq-psychic'

export default async function setNextPsychic(
  game: CurrentFreqGameView,
  player: unknown
) {
  if (!isPlayer(player)) {
    const msg = "Command 'set-next-psychic' requires valid 'player'."
    throw new TypeError(msg)
  }

  const allow = game.canChangePsychicTo
  if (allow === 'none')
    throw new Error('Can only change the psychic in the free phases.')

  if (
    allow === 'same_team' &&
    (game.repeat_turn
      ? player.team === getNextPsychic(game)?.psychic?.team
      : player.team !== getNextPsychic(game)?.psychic?.team)
  )
    throw new Error('Can only change psychic within same team during game')

  if (player.team == null)
    throw new Error('Cannot make audience members the psychic')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await fromGames(db).updateOne(filter, {
    $set: {
      next_psychic: player.id,
    },
  })
}
