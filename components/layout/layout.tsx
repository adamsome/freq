import type { ReactNode } from 'react'
import React from 'react'
import { GameType } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { ButtonProps } from '../control/button'
import Header from './header'
import Helmet from './helmet'

type Props = {
  children: ReactNode
  className?: string
  contentClassName?: string
  type?: GameType
  title?: string
  room?: string
  big?: boolean
  button?: Partial<ButtonProps>
  flexWrapper?: boolean
  overflowAuto?: boolean
  sticky?: boolean
  WrapperOverride?: React.FC<{ children: React.ReactNode }>
  onLogoClick?: () => void
  onTitleClick?: () => void
}

export default function Layout(props: Props) {
  const {
    children,
    className,
    contentClassName,
    title,
    room,
    big,
    flexWrapper = true,
    overflowAuto = true,
    WrapperOverride,
    ...headerProps
  } = props
  return (
    <>
      <Wrapper
        className={className}
        flexWrapper={flexWrapper}
        WrapperOverride={WrapperOverride}
      >
        <Helmet title={title} room={room} />

        <Header {...headerProps} />

        <ContentWrapper
          className={contentClassName}
          big={big}
          overflowAuto={overflowAuto}
          flexWrapper={flexWrapper}
        >
          {children}
        </ContentWrapper>
      </Wrapper>
    </>
  )
}

function Wrapper(props: Props) {
  const { children, className, flexWrapper, WrapperOverride } = props
  if (WrapperOverride) {
    return <WrapperOverride>{children}</WrapperOverride>
  }
  if (!flexWrapper) {
    return <div className={className}>{children}</div>
  }
  return (
    <div
      className={cx(`
        flex-center min-h-screen min-w-min flex-col overflow-hidden
        bg-white text-black
        transition
        dark:bg-black dark:text-white
        ${className}
      `)}
    >
      {children}
    </div>
  )
}

function ContentWrapper(props: Props) {
  const { children, className, big, overflowAuto, flexWrapper } = props
  return (
    <div
      className={cx(
        className,
        flexWrapper && {
          'flex flex-1 flex-col items-center': true,
          'h-full w-full': true,
          'overflow-auto': overflowAuto,
          'pt-16': big,
          'pt-12': !big,
        }
      )}
    >
      {children}
    </div>
  )
}
