import React, { useState } from 'react'
import Modal from 'react-responsive-modal'
import { Player } from '../types/game.types'
import PlayerButton from './player-button'
import PlayerEdit from './player-edit'

type Props = typeof defaultProps & {
  room: string
  player: Player
}

const defaultProps = {}

const PlayerHero = ({ room, player }: Props) => {
  const [modelOpen, setModelOpen] = useState(false)
  const handleModalOpen = () => setModelOpen(true)
  const handleModalClose = () => setModelOpen(false)

  return (
    <>
      <PlayerButton player={player} size="xl" onClick={handleModalOpen} />

      <Modal
        open={modelOpen}
        onClose={handleModalClose}
        center
        classNames={{ modal: 'freq-model-reset-sm' }}
      >
        <PlayerEdit room={room} player={player} onClose={handleModalClose} />
      </Modal>
    </>
  )
}

PlayerHero.defaultProps = defaultProps

export default PlayerHero
