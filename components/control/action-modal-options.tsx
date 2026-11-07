import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function ActionModalOptions({ children }: Props) {
  return (
    <div className="flex w-72 flex-col items-start p-0 sm:w-96">{children}</div>
  )
}
