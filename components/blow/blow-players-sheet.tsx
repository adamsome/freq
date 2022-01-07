import { BottomSheet } from 'react-spring-bottom-sheet'
import BlowPlayerSeatsContainer from './blow-player-seats-container'

export default function BlowPlayersSheet() {
  return (
    <BottomSheet
      open
      skipInitialTransition
      expandOnContentDrag
      blocking={false}
      snapPoints={({ minHeight, maxHeight }) => [
        maxHeight - maxHeight / 10,
        minHeight,
        maxHeight * 0.6,
      ]}
      defaultSnap={({ minHeight }) => minHeight}
    >
      <div className="flex-center px-2 pb-5">
        <BlowPlayerSeatsContainer />
      </div>
    </BottomSheet>
  )
}
