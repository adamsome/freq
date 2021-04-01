import { CwdGame, FullCwdGameView } from '../../../types/cwd.types'
import { connectToDatabase } from '../../../util/mongodb'
import { isPlayer } from '../../player'
import { fromCwdGames } from '../cwd-game-store'

export default async function setCurrentPsychic(
  game: FullCwdGameView,
  player: unknown
) {
  if (!isPlayer(player)) {
    const msg = "Command 'set-current-psychic' requires valid 'player'."
    throw new TypeError(msg)
  }

  if (game.phase !== 'prep')
    throw new Error('Can only change psychic during prep.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<CwdGame> = {}

  if (game.settings?.designated_psychic) {
    changes.psychic_1 = player.id
    changes.psychic_2 = player.id
  } else {
    if (player.team === 1) changes.psychic_1 = player.id
    if (player.team === 2) changes.psychic_2 = player.id
  }

  await fromCwdGames(db).updateOne(filter, { $set: changes })
}
