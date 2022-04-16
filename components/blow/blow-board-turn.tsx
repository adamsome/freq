import type { ReactNode } from 'react'
import invariant from 'tiny-invariant'
import { getBlowRole } from '../../lib/blow/blow-role-defs'
import {
  BlowActionState,
  BlowCardVariant,
  BlowGameView,
  BlowLabelDef,
  BlowRoleActionID,
  BlowRoleDef,
  BlowRoleID,
} from '../../lib/types/blow.types'
import { Command, CommandError } from '../../lib/types/game.types'
import { RequireProp } from '../../lib/types/object.types'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import Arrow from '../control/arrow'
import BlowBoardCommand from './blow-board-command'
import BlowBoardDrawCards from './blow-board-draw-cards'
import BlowCardContainer from './blow-card-container'
import BlowPlayerSeat from './blow-player-seat'
import getBlowRoleView from './blow-role-card-view'
import BlowLabel from './tokens/blow-label'

type Props = {
  className?: string
  onCommandError?: (error: CommandError) => void
}

interface LabelProps {
  children: BlowLabelDef
  className?: string
}

type ActiveTurnGame = RequireProp<BlowGameView, 'active' | 'turn'>

const LABEL_CLASSES = 'font-narrow text-black/60 dark:text-white/40'

export default function BlowBoardTurn(props: Props) {
  const { onCommandError } = props
  const { game } = useBlowGame()
  if (!isActiveTurnGame(game)) return null

  const { players, turn, actionState } = game
  const {
    step,
    role,
    targetable,
    target,
    activeLabel,
    activeCmd,
    counterLabel,
    counters,
    counterCmd,
    counterAction: counter,
    resolution,
    nextCmd,
  } = turn

  const theme = game.settings.theme

  const activeStep = step.startsWith('active')
  const counterStep = step.startsWith('counter')

  const view = getBlowRoleView(theme, role, actionState, { active: true })
  const roleDef = view.role
  invariant(roleDef, `No role definition found for '${role}'`)

  const activeCounter =
    counter && (step === 'counter-challenge' || step === 'next')

  const showCounter = !game.drawCards
  const showCounterCmd =
    showCounter && counters.length > 0 && (activeStep || counterStep)
  const showDrawCards =
    game.drawCards && game.currentPlayer?.index === game.active
  const showResolution =
    resolution != null && (!showDrawCards || game.drawCards?.selected)

  const Label = ({ children, className }: LabelProps) => (
    <TurnLabel {...game} className={cx(className, LABEL_CLASSES)}>
      {children}
    </TurnLabel>
  )

  const Focus = ({ children, className, lit, ...props }: FocusBoxProps) => (
    <FocusBox
      {...props}
      className={cx(
        className,
        lit ? view.classes.button : 'bg-black/10 dark:bg-white/25'
      )}
    >
      {children}
    </FocusBox>
  )

  return (
    <div className="px-2.5 xs:px-5">
      <Focus lit={activeStep} innerClassName="px-2 pt-3 pb-2">
        <Label className="absolute top-1 text-sm">{activeLabel}</Label>

        <div className={cx('flex items-center gap-2', !targetable && 'mt-4')}>
          <Card
            {...game}
            className="self-end text-black/90"
            index={getCommonActionIndex(game)}
            customActions={asActiveActionState(roleDef, actionState)}
            showOnly="active"
          />

          {targetable && (
            <>
              <div className="w-4">
                <Arrow right />
              </div>

              <BlowPlayerSeat
                className="flex-none"
                game={game}
                player={target != null ? players[target] : null}
                actions={actionState}
                theme={theme}
                card={{ color: 'gray' }}
                emptyContent={
                  <Label className="text-center">
                    {getActiveTargetLabel(game)}
                  </Label>
                }
              />
            </>
          )}
        </div>
      </Focus>

      <Cmd {...props} command={activeCmd} show={activeStep} />

      {showCounter && (
        <Focus
          lit={counterStep}
          className={cx(`mt-4 ${activeStep ? 'opacity-50' : ''}`)}
          innerClassName="px-2 pt-1 pb-2 space-y-1 "
        >
          <Label className="text-sm">{counterLabel}</Label>

          <div className="flex gap-1.5 xs:gap-2 sm:gap-4">
            {counters.map((counter) => (
              <div
                key={counter}
                className="w-full rounded-md bg-white/100 dark:bg-black/100"
              >
                <Card
                  {...game}
                  className={cx(
                    !activeCounter && 'bg-opacity-50 dark:bg-opacity-50'
                  )}
                  role={counter}
                  customActions={asCounterActionState(game)}
                  showOnly="counter"
                  disableOpacity={activeCounter}
                />
              </div>
            ))}
            {counters.length === 0 && (
              <Card
                {...game}
                variant="empty"
                emptyMessage={
                  <div className="flex-center h-full italic text-black/30 dark:text-white/30">
                    No Counters
                  </div>
                }
              />
            )}
          </div>
        </Focus>
      )}

      <Cmd {...props} command={counterCmd} show={showCounterCmd} />

      {showDrawCards && (
        <Focus
          className="mt-4"
          innerClassName="px-2 pb-2"
          lit={!game.drawCards?.selected}
        >
          <BlowBoardDrawCards
            className="w-full"
            onCommandError={onCommandError}
          />
        </Focus>
      )}

      {showResolution && (
        <Focus
          className="mt-4"
          innerClassName="px-2 flex-center space-x-1 "
          lit
        >
          <div className={cx(`flex-center flex-1 leading-tight`)}>
            <Label className="flex-1">{resolution}</Label>
          </div>

          {nextCmd && (
            <Cmd
              {...props}
              className="h-16 w-28 py-2"
              innerClassName="w-full"
              command={nextCmd}
              position="grid-item"
            />
          )}
        </Focus>
      )}
    </div>
  )
}

function TurnLabel(props: ActiveTurnGame & LabelProps) {
  const { children, className, settings, players } = props
  return (
    <BlowLabel
      className={className}
      theme={settings.theme}
      players={players}
      label={children}
    />
  )
}

interface CardProps {
  className?: string
  role?: BlowRoleID
  index?: number
  customActions?: Partial<Record<BlowRoleActionID, BlowActionState>>
  showOnly?: 'active' | 'counter'
  clickable?: boolean
  variant?: BlowCardVariant
  emptyMessage?: ReactNode
  disableOpacity?: boolean
}

function Card(game: ActiveTurnGame & CardProps) {
  const {
    className,
    role: roleProp,
    index,
    customActions,
    showOnly,
    clickable,
    variant = 'faceup',
    emptyMessage,
    disableOpacity,
  } = game
  const role = roleProp ?? game.turn.role
  return (
    <BlowCardContainer
      className={className}
      id={role}
      index={index}
      size="lg"
      orientation="horizontal"
      variant={variant}
      emptyMessage={emptyMessage}
      type={role === 'common' ? 'role-common' : 'role'}
      actions={customActions}
      currentCards={getCurrentCardCount(game)}
      showOnly={showOnly}
      clickable={clickable}
      disableOpacity={disableOpacity}
    />
  )
}

interface CmdProps {
  innerClassName?: string
  command: Command
  show?: boolean
  position?: 'bottom' | 'grid-item' | 'action-bottom'
}

function Cmd(props: Props & CmdProps) {
  const { className, innerClassName, command, show, position, onCommandError } =
    props
  return (
    <div
      className={cx(
        className ?? '-mt-px w-full transition-all',
        show === undefined ? '' : show ? 'h-8' : 'h-0 overflow-hidden'
      )}
    >
      <BlowBoardCommand
        className={cx(
          innerClassName ?? 'w-full px-4',
          show ?? true ? 'h-full' : 'h-0 overflow-hidden'
        )}
        command={command}
        position={position ?? 'action-bottom'}
        onCommandError={onCommandError}
      />
    </div>
  )
}

interface FocusBoxProps {
  children: ReactNode
  className?: string
  innerClassName?: string
  lit?: boolean
}

function FocusBox(props: FocusBoxProps) {
  const { children, className, innerClassName } = props
  return (
    <div className={cx(className, `relative z-10 rounded-xl p-0.5 `)}>
      <div
        className={cx(
          innerClassName,
          `relative rounded-[0.625rem] bg-white dark:bg-black `
        )}
      >
        {children}
      </div>
    </div>
  )
}

function isActiveTurnGame(game?: BlowGameView): game is ActiveTurnGame {
  return game != null && game.active != null && game.turn != null
}

function getActiveTargetLabel(game: ActiveTurnGame): BlowLabelDef {
  const { currentPlayer, active } = game
  const isActive = currentPlayer?.index === active
  const redClass = 'text-red-500'
  const targetText: BlowLabelDef = {
    type: 'text',
    value: 'target',
    className: redClass,
  }
  return isActive ? ['Choose', targetText, 'below'] : ['Choosing', targetText]
}

function getCurrentCardCount(game: ActiveTurnGame) {
  const { currentPlayer, turn } = game
  const { role } = turn
  const cards = currentPlayer?.cards ?? []
  const cardsKilled = currentPlayer?.cardsKilled
  let currentCards = 0
  if (role && cardsKilled) {
    currentCards = cards.filter((r, i) => r === role && !cardsKilled[i]).length
  }
  return currentCards
}

function getCommonActionIndex(game: ActiveTurnGame) {
  const { turn, settings } = game
  if (turn.role === 'common') {
    const def = getBlowRole(settings.theme, turn.role)
    return def.actions.findIndex((xid) => xid === turn.action)
  }
}

const asActiveActionState = (
  role: BlowRoleDef,
  actionState: Partial<Record<BlowRoleActionID, BlowActionState>>
) =>
  Object.keys(actionState).reduce((acc, key) => {
    const actionID = key as BlowRoleActionID
    acc[actionID] = role.actions.includes(actionID) ? 'active' : 'clickable'
    return acc
  }, {} as Partial<Record<BlowRoleActionID, BlowActionState>>)

const asCounterActionState = (game: ActiveTurnGame) =>
  Object.keys(game.actionState).reduce((acc, key) => {
    const actionID = key as BlowRoleActionID
    const state = game.actionState[actionID]
    if (state !== 'active') {
      acc[actionID] = state
    }
    return acc
  }, {} as Partial<Record<BlowRoleActionID, BlowActionState>>)
