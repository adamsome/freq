import { useEffect, useState } from 'react'
import { isBlowAction } from '../../lib/blow/blow-action-creators'
import { BlowLabelItem, BlowThemeID } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import BlowLabel from './blow-label'

type Props = {
  className?: string
  theme: BlowThemeID
  onChange?: () => void
}

export default function BlowMessageCurrent(props: Props) {
  const [state, setState] = useState('none')
  const { game } = useBlowGame()
  const { className, onChange } = props

  useEffect(() => {
    onChange?.()
  }, [state, onChange])

  let label: BlowLabelItem[] = []

  if (
    game?.phase !== 'guess' ||
    game.drawCards ||
    game.challenge ||
    game.pickLossCard ||
    game.pickTarget
  ) {
    if (state !== 'none') setState('none')
    return null
  }

  const value = game.commands[0].value
  const action = isBlowAction(value) ? value : null

  if (
    action?.type === 'challenge' &&
    Object.values(game.actionState).some((s) => s === 'active')
  ) {
    // Challenge mode
    label = ['Players can challenge...']
    if (state !== 'challenge') setState('challenge')
  } else if (action?.type === 'decline_counter') {
    // Counter mode
    if (game.counter?.length === 1) {
      label = [{ type: 'player', value: game.counter[0] }, 'can counter...']
    } else {
      label = ['Players can counter...']
    }

    if (state !== 'counter') setState('counter')
  } else if (game.active != null && action?.type !== 'next_turn') {
    // Active mode
    label = [{ type: 'player', value: game.active }, 'starts the turn...']
    if (state !== 'active') setState('active')
  }

  if (label.length === 0) {
    if (state !== 'none') setState('none')
    return null
  }

  return (
    <BlowLabel
      className={cx('opacity-60', className)}
      label={label}
      players={game.players}
      theme={game.settings.theme}
    />
  )
}
