import { BottomSheet } from 'react-spring-bottom-sheet'
import { CommandError } from '../../lib/types/game.types'
import BlowPlayerSeatsContainer from './blow-player-seats-container'

type Props = {
  onCommandError?: (error: CommandError) => void
}

export default function BlowPlayersSheet(props: Props) {
  const { onCommandError } = props
  return (
    <BottomSheet
      className="freq-disable-scroll relative z-30"
      open
      skipInitialTransition
      expandOnContentDrag
      scrollLocking={false}
      blocking={false}
      snapPoints={({ minHeight, maxHeight }) => [
        32,
        maxHeight - maxHeight / 10,
        minHeight,
        maxHeight * 0.6,
      ]}
      defaultSnap={({ minHeight }) => minHeight}
    >
      <div className="flex-center px-2 pb-5 full overflow-hidden">
        <BlowPlayerSeatsContainer onCommandError={onCommandError} />
      </div>
    </BottomSheet>
  )
}
