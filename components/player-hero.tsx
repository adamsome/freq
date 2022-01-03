import { useState } from 'react'
import ActionModal from './control/action-modal'
import PlayerButton from './player-button'
import PlayerEdit from './player-edit'

type Props = typeof defaultProps

const defaultProps = {}

const PlayerHero = (_: Props) => {
  const [modelOpen, setModelOpen] = useState(false)
  const handleModalOpen = () => setModelOpen(true)
  const handleModalClose = () => setModelOpen(false)

  return (
    <>
      <div className="mb-6">
        <PlayerButton hero onClick={handleModalOpen} />
      </div>

      <ActionModal open={modelOpen} onClose={handleModalClose}>
        <PlayerEdit onClose={handleModalClose} />
      </ActionModal>
    </>
  )
}

PlayerHero.defaultProps = defaultProps

export default PlayerHero
