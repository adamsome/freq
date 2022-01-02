import getNextPsychicsInfo from '../../get-next-psychics-info'
import { getPlayersPerTeam } from '../../player'
import { CwdGame, FullCwdGameView } from '../../types/cwd.types'
import { Dict } from '../../types/object.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromCwdGames } from '../cwd-game-store'

export default async function setDesignatedPsychicMode(
  game: FullCwdGameView,
  value: unknown
) {
  if (typeof value !== 'boolean') {
    const msg = "Command 'set-designated-psychic-mode' requires boolean value."
    throw new TypeError(msg)
  }

  if (game.phase !== 'prep')
    throw new Error('Can only change psychic during prep.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  let changes: Partial<CwdGame> & Dict<unknown> = {
    ['settings.designated_psychic']: value,
  }

  if (value) {
    // Set the designated psychic to the current sole psychic, or, to the
    // psychic w/ the most people on their team
    let psychic: string | undefined

    if (game.psychic_1 && !game.psychic_2) {
      psychic = game.psychic_1
    } else if (!game.psychic_1 && game.psychic_2) {
      psychic = game.psychic_2
    } else {
      const [t1, t2] = getPlayersPerTeam(game.players)
      if (t2.length > t1.length) {
        psychic = game.psychic_2
      } else {
        psychic = game.psychic_1
      }
    }

    changes.psychic_1 = psychic
    changes.psychic_2 = psychic
  } else {
    // Set the two normal psychic's using the normal get next function
    const info = getNextPsychicsInfo(game.psychic_history, game.players)
    changes = { ...changes, ...info }
  }

  await fromCwdGames(db).updateOne(filter, { $set: changes })
}
