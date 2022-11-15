import React from 'react'
import { getGameTitle } from '../../lib/game'
import { useResGame } from '../../lib/util/use-game'
import { ButtonProps } from '../control/button'
import Header from '../layout/header'
import Helmet from '../layout/helmet'
import ResLayoutWrapper from './res-layout-wrapper'

type Props = {
  children: React.ReactNode
}

export default function ResLayout({ children }: Props) {
  const { game } = useResGame()

  const type = 'res'
  const title = getGameTitle(type)
  const buttonProps: ButtonProps = {
    color: 'phosphorus',
    className: 'inline-flex font-spaced-medium',
  }
  const colorClass = `border-b border-phosphorus-900/50 bg-phosphorus-950/50 backdrop-blur-[10px]`

  return (
    <ResLayoutWrapper>
      <Helmet title={title} room={game?.room} />
      <Header type="res" button={buttonProps} colorClass={colorClass} sticky />
      <div className="[--freq-button-weight:600]">{children}</div>
    </ResLayoutWrapper>
  )
}
