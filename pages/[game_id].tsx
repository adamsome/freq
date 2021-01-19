import { useRouter } from 'next/router'

const Game = () => {
  const router = useRouter()
  const { game_id } = router.query

  return <p>Game: {game_id}</p>
}

export default Game
