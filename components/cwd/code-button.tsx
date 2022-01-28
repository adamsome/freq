import { getTeamColor } from '../../lib/color-dict'
import { cwdCodeEquals } from '../../lib/cwd/build-cwd-code-views'
import {
  CwdCodeState,
  CwdCodeView,
  CwdLastAct,
} from '../../lib/types/cwd.types'
import { PlayerView } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { styleBorder, styleColor } from '../../lib/util/dom-style'
import useConditionalDebounce from '../../lib/util/use-conditional-debounce'
import { useTheme } from '../../lib/util/use-theme'
import SkeletonBox from '../layout/skeleton-box'

type Props = typeof defaultProps & {
  code?: CwdCodeView
  guess?: CwdLastAct
  currentPlayer?: PlayerView
  psychic1?: PlayerView
  psychic2?: PlayerView
  onClick: () => void
}

const defaultProps = {}

const isRevealed = (
  prev?: CwdCodeView,
  next?: CwdCodeView
): boolean | undefined => prev && next && prev?.revealed !== next?.revealed

export default function CodeButton({
  code: rawCode,
  guess,
  currentPlayer,
  psychic1,
  psychic2,
  onClick,
}: Props) {
  const { resolvedTheme } = useTheme()

  // If this code was just revealed, delay the unveiling
  const code = useConditionalDebounce(rawCode, {
    conditionFn: isRevealed,
    equalsFn: cwdCodeEquals,
    // Add extra reveal delay if we're revealing a scratch, less if correct
    debounceTime: () =>
      guess?.state === -1 ? 4000 : guess?.correct ? 500 : 2000,
  })

  if (!code)
    return (
      <SkeletonBox className="w-full h-16 sm:h-24 md:h-28" rounded={false} />
    )

  const samePsychics = psychic1 === psychic2

  function getColor(state?: CwdCodeState) {
    switch (state) {
      case 0:
        return resolvedTheme === 'dark' ? 'TaupeDark' : 'Taupe'
      case 1:
        return samePsychics ? getTeamColor(1) : psychic1?.color
      case 2:
        return samePsychics ? getTeamColor(2) : psychic2?.color
      default:
        return undefined
    }
  }

  const textSize = getTextSize(code.word.length)
  const brokenTextSize = getTextSize(code.brokenLength)
  const borderColor = code.state !== -1 ? getColor(code.state) : undefined
  const bgColor = getColor(code.revealed)
  const scratch =
    code.state === -1
      ? 'radial-gradient(circle at 30% 107%, rgb(243 227 119) 0%, rgb(111 89 34) 5%, rgb(49 14 14) 45%, rgb(31 0 14) 60%, rgb(1 4 113) 90%)'
      : undefined

  return (
    <div
      className={cx(
        'flex flex-center w-full h-16 sm:h-24 md:h-28 px-4 relative',
        'bg-gray-100 dark:bg-gray-900',
        'break-normal text-center font-semibold',
        'border border-transparent select-none',
        textSize,
        {
          'text-amber-400': code.state === -1,
          'cursor-pointer hover:border-blue-700': code.clickable,
          'cursor-default': !code.clickable,
        }
      )}
      style={{
        backgroundImage: scratch,
        ...styleColor(bgColor ?? borderColor, bgColor ? 1 : 0),
      }}
      onClick={() => code.clickable && onClick()}
    >
      {code.selected && (
        <div
          className={cx('absolute w-full h-full border-2')}
          style={styleBorder(currentPlayer?.color)}
        ></div>
      )}

      <div className="absolute w-full bottom-0 text-sm sm:text-base md:text-2xl">
        {code.icons.slice(0, 3).map((icon, i) => (
          <div key={i + icon}>{icon}</div>
        ))}
      </div>

      <span
        className={cx('relative hidden md:inline', {
          'animate-bounce-5': code.lit,
          'animate-pulse': rawCode?.lit,
        })}
      >
        {code.word}
      </span>

      <span
        className={cx(
          brokenTextSize,
          'relative inline md:hidden leading-none sm:leading-none',
          {
            'animate-bounce-5': code.lit,
            'animate-pulse': rawCode?.lit,
          }
        )}
      >
        {code.brokenWord}
      </span>
    </div>
  )
}

CodeButton.defaultProps = defaultProps

function getTextSize(n: number) {
  return n < 4
    ? 'text-3xl sm:text-4xl'
    : n < 5
    ? 'text-2xl sm:text-4xl'
    : n < 6
    ? 'text-xl sm:text-3xl'
    : n < 7
    ? 'text-lg sm:text-2xl md:text-3xl'
    : n < 8
    ? 'text-base sm:text-xl md:text-2xl'
    : 'text-sm sm:text-xl md:text-xl'
}
