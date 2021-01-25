import useGame from '../hooks/use-game'

const ActionPanel = () => {
  const [game] = useGame()
  if (!game) return null
  return <div>Action Panel</div>
}

export default ActionPanel
