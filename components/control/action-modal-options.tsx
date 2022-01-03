import type { ReactNode } from 'react'

type Props = typeof defaultProps & {
  children: ReactNode
}

const defaultProps = {}

export default function ActionModalOptions({ children }: Props) {
  return (
    <div className="flex flex-col items-start p-0 w-72 sm:w-96">{children}</div>
  )
}

ActionModalOptions.defaultProps = defaultProps
