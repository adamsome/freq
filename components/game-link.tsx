import Button from './control/button'
import SkeletonBox from './layout/skeleton-box'

type Props = typeof defaultProps & {
  url?: string
}

const defaultProps = {}

export default function GameLink({ url }: Props) {
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
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        {url}
      </Button>
    </div>
  )
}

GameLink.defaultProps = defaultProps
