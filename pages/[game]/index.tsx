import type { ReactNode } from 'react'
import HomeContainer from '../../components/home-container'

type Props = typeof defaultProps

const defaultProps = {}

export default function GamePage(_: Props): ReactNode {
  return <HomeContainer />
}

GamePage.defaultProps = defaultProps
