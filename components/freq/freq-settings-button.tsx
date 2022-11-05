import { useState } from 'react'
import { useFreqGame } from '../../lib/util/use-game'
import ActionModal from '../control/action-modal'
import Button from '../control/button'
import FreqSettings from './freq-settings'

export default function FreqSettingsButton() {
  const { game } = useFreqGame()
  const [open, setOpen] = useState(false)

  if (!game) return null

  return (
    <>
      <div className="mb-6">
        <Button className="text-xl" onClick={() => setOpen(true)}>
          Change Room Settings
        </Button>
      </div>

      <ActionModal open={open} onClose={() => setOpen(false)}>
        <FreqSettings onClose={() => setOpen(false)} />
      </ActionModal>
    </>
  )
}
