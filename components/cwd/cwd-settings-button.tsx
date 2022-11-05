import { useState } from 'react'
import { useCwdGame } from '../../lib/util/use-game'
import ActionModal from '../control/action-modal'
import Button from '../control/button'
import CwdSettings from './cwd-settings'

type Props = typeof defaultProps

const defaultProps = {}

export default function CwdSettingsButton(_: Props) {
  const { game } = useCwdGame()
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
        <CwdSettings onClose={() => setOpen(false)} />
      </ActionModal>
    </>
  )
}

CwdSettingsButton.defaultProps = defaultProps
