import type { ReactNode } from 'react'
import { GameType } from '../types/game.types'
import { cx } from '../util/dom'
import Layout from './layout'
import RepoLink from './repo-link'
import Title from './title'

type Props = typeof defaultProps & {
  children: ReactNode
  type?: GameType
  message?: string
  invisible?: boolean
  subtle?: boolean
  error?: boolean
}

const defaultProps = {}

export default function TitleMessage({
  children,
  type,
  message,
  invisible,
  subtle,
  error,
}: Props) {
  return (
    <Layout type={type}>
      <main
        className={cx(
          'flex-1 flex-center flex-col px-6 py-4',
          'text-black dark:text-white'
        )}
      >
        <Title type={type} animate={true} />

        <div
          className={cx('flex flex-col items-center text-center h-96', {
            hidden: invisible,
            'text-gray-500': subtle,
            'text-red-700': error,
          })}
        >
          <p className="mt-6 mb-8 text-xl">{message ? message : children}</p>

          {message && children}

          <RepoLink classNames="mt-6" />
        </div>
      </main>
    </Layout>
  )
}

TitleMessage.defaultProps = defaultProps
