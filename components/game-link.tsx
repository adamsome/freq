import { cx } from '../lib/util/dom'
import Button, { ButtonProps } from './control/button'
import SkeletonBox from './layout/skeleton-box'

type Props = {
  url?: string
  button?: Partial<ButtonProps>
  className?: string
}

export default function GameLink({ url, button = {}, className = '' }: Props) {
  if (!url) {
    return <SkeletonBox className="h-8 w-full" />
  }

  return (
    <div
      className={cx(`
        flex-center w-full flex-col text-sm font-light ${className}
      `)}
    >
      <div className="text-gray-500">
        Other players can use this link to join:
      </div>
      <Button
        className="text-center text-sm"
        spacing="m-0 p-0"
        selectable
        href={url}
        target="_blank"
        rel="noreferrer"
        {...button}
      >
        {url}
      </Button>
    </div>
  )
}
