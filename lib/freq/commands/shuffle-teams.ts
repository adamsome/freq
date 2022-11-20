import * as crypto from 'crypto'
import { assignColor } from '../../color-dict'
import { CurrentFreqGameView, FreqGame } from '../../types/freq.types'
import { PlayerView } from '../../types/game.types'
import { Dict } from '../../types/object.types'
import { partition, range } from '../../util/array'
import { connectToDatabase } from '../../util/mongodb'
import { countBinaryOnes } from '../../util/number'
import { shuffle } from '../../util/random'
import { fromGames } from '../freq-game-store'
import { getNextPsychic } from '../freq-psychic'

export default async function shuffleTeams(game: CurrentFreqGameView) {
  if (game.phase !== 'prep') throw new Error('Can only shuffle teams in prep.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }
  const changes: Record<string, string | number | number[]> &
    Partial<FreqGame> = {}

  const indexByPlayerID = game.players.reduce((acc, p, i) => {
    acc[p.id] = i
    return acc
  }, {} as Dict<number>)

  const [teamPlayers] = partition((p) => p.team != null, game.players)
  const sortedPlayers = teamPlayers
    .filter((p) => !p.designatedPsychic)
    .sort((a, b) => a.id.localeCompare(b.id))

  if (sortedPlayers.length > 12)
    throw new Error('12 is the max player shuffle size.')

  // Get unique hash for the current players
  const playerIDs = sortedPlayers.map((p) => p.id)
  const hash = crypto.createHash('md5').update(playerIDs.join('')).digest('hex')

  let combos = game.team_combos?.[hash]

  if (!combos) {
    // Create all valid team combinations for this set of players
    const playerCount = sortedPlayers.length
    const possibleCombos = range(0, 2 ** (playerCount - 1))
    const validCombos = possibleCombos.filter(hasEqualPlayers(playerCount))
    combos = shuffle(validCombos)
    changes[`team_combos.${hash}`] = combos
  }

  // Increment combo index (or initialize to zero) and set for update
  const index = (game.team_combos_index?.[hash] ?? -1) + 1
  changes[`team_combos_index.${hash}`] = index

  const nextCombo = combos[index % combos.length]

  // Randomize which team represents '0' bit and which '1' bit
  const teamZero = Math.random() < 0.5 ? 1 : 2
  const teamOne = teamZero === 1 ? 2 : 1

  const { nextPlayers } = sortedPlayers.reduce(
    (acc, player, i) => {
      const bitmask = 1 << i
      const team = (nextCombo & bitmask) === 0 ? teamZero : teamOne
      const color = assignColor(team, acc.existingColors)

      acc.nextPlayers.push({ ...player, team, color })

      const index = indexByPlayerID[player.id]
      if (index != null) {
        acc.existingColors.push(color)

        changes[`players.${index}.team`] = team
        changes[`players.${index}.color`] = color
      }

      return acc
    },
    { existingColors: [], nextPlayers: [] } as {
      existingColors: string[]
      nextPlayers: PlayerView[]
    }
  )

  if (!game.settings?.designated_psychic) {
    const nextTurn: 1 | 2 = Math.random() < 0.5 ? 1 : 2
    const nextGame = { ...game, players: nextPlayers, team_turn: nextTurn }
    const { psychic } = getNextPsychic(nextGame)
    if (psychic) changes.psychic = psychic.id
  }

  await fromGames(db).updateOne(filter, {
    $set: changes,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
}

const hasEqualPlayers = (playerCount: number) => (combo: number) => {
  const teamSize = playerCount / 2
  const oneCount = countBinaryOnes(combo)

  if (playerCount % 2 === 0) {
    return oneCount === teamSize
  } else {
    return oneCount === Math.floor(teamSize) || oneCount === Math.ceil(teamSize)
  }
}
