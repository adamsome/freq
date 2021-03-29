import React from 'react'
import { cx } from '../util/dom'
import Button from './button'
import Logo from './logo'

type Props = typeof defaultProps

const defaultProps = {
  classNames: '',
}

export default function RepoLink({ classNames }: Props) {
  return (
    <Button
      className={cx('flex items-center text-center text-xl group', classNames)}
      href="https://github.com/adamsome/freq"
      target="_blank"
      rel="noreferrer"
    >
      <Logo
        color="text-blue-600 group-hover:text-blue-400 transition-colors"
        inner="text-white dark:text-black group-hover:text-red-600 transition-colors"
      />
      adamsome
    </Button>
  )
}

RepoLink.defaultProps = defaultProps
