import React from 'react'
import { cx } from '../util/dom'
import Button from './button'
import Layout from './layout'
import Title from './title'

type Props = typeof defaultProps & {
  children: React.ReactNode
  message?: string
  invisible?: boolean
  subtle?: boolean
  error?: boolean
}

const defaultProps = {}

export default function TitleMessage({
  children,
  message,
  invisible,
  subtle,
  error,
}: Props) {
  return (
    <Layout>
      <main
        className={cx(
          'flex-1 flex-center flex-col px-6 py-4',
          'text-black dark:text-white'
        )}
      >
        <Title animate={true} />

        <div
          className={cx('flex flex-col items-center text-center h-96', {
            hidden: invisible,
            'text-gray-500': subtle,
            'text-red-700': error,
          })}
        >
          <p className="mt-6 mb-8 text-xl">{message ? message : children}</p>

          {message && children}

          <Button
            href="https://github.com/adamsome/freq"
            target="_blank"
            rel="noreferrer"
            className="mt-6"
          >
            adamsome
          </Button>
        </div>
      </main>
    </Layout>
  )
}

TitleMessage.defaultProps = defaultProps
