import type { ReactNode } from 'react'
import { GameType } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import Layout from '../layout/layout'
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
        className={cx(`
          flex-center flex-1 flex-col px-6 py-4
          text-black dark:text-white
        `)}
      >
        <Title type={type} animate={true} />

        <div
          className={cx('flex h-96 flex-col items-center text-center', {
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
