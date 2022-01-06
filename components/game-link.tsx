import Button, { ButtonProps } from './control/button'
import SkeletonBox from './layout/skeleton-box'

type Props = {
  url?: string
  button?: Partial<ButtonProps>
}

export default function GameLink({ url, button = {} }: Props) {
  if (!url) {
    return <SkeletonBox className="w-full h-8" />
  }

  return (
    <div className="flex-center flex-col w-full mt-6 mb-6 text-sm font-light">
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
