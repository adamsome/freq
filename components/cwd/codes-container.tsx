import produce from 'immer'
import { postCommand } from '../../lib/util/fetch-json'
import { useDebounceCallback } from '../../lib/util/use-debounce'
import { useCwdGame } from '../../lib/util/use-game'
import CodeGrid from './code-grid'

type Props = typeof defaultProps

const defaultProps = {}

export default function CodesContainer(_: Props) {
  const { game, mutate } = useCwdGame()

  const handleCodeClick = useDebounceCallback(async (index: number) => {
    if (!game) return

    try {
      await postCommand('cwd', game.room, 'set_guess', index)
      mutate(
        produce((game) => {
          if (!game || !game.currentPlayer?.icon) return

          game.codes[index].selected = true
          const icon = game.currentPlayer.icon
          if (game.codes[index].icons?.find((it) => it === icon)) return
          if (!game.codes[index].icons) game.codes[index].icons = []
          game.codes[index].icons.push(game.currentPlayer.icon)
        }, game)
      )
    } catch (err) {
      console.error(`Error setting guess.`, err.data ?? err)
    }
  }, 300)

  return <CodeGrid game={game} onCodeClick={handleCodeClick} />
}

CodesContainer.defaultProps = defaultProps
