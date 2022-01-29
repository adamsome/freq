import invariant from 'tiny-invariant'
import { getBlowRoleAction } from '../../lib/blow/blow-role-action-defs'
import { getBlowRole } from '../../lib/blow/blow-role-defs'
import {
  BlowActionButtonColor,
  BlowActionState,
  BlowRoleActionDef,
  BlowRoleActionID,
  BlowRoleClasses,
  BlowRoleDef,
  BlowRoleID,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { partition } from '../../lib/util/array'

export interface BlowRoleViewActionClasses {
  text?: string[]
  hint?: string[]
  icon?: string[]
  coinColor: BlowActionButtonColor
}

interface GetBlowRoleViewOptions {
  useActionIndex?: number
  useActionID?: BlowRoleActionID
  clickable?: boolean
  disable?: boolean
}

interface RoleViewClasses {
  fg: string[]
  bg: string[]
  bgActive: string[]
  border: string[]
}

interface BlowRoleViewClasses {
  button?: string[]
  title?: string[]
  roleIcon?: string[]
  active: BlowRoleViewActionClasses
  counter: BlowRoleViewActionClasses
  separator?: string[]
}

export interface BlowRoleView {
  role?: BlowRoleDef
  active?: BlowRoleActionDef
  counter?: BlowRoleActionDef
  clickableID?: BlowRoleActionID
  classes: BlowRoleViewClasses
}

const TEXT = {
  body: 'text-black dark:text-white',
  white: 'text-white dark:text-white',
  black: 'text-black dark:text-black',
  alpha20: 'text-opacity-20 dark:text-opacity-20',
  alpha25: 'text-opacity-25 dark:text-opacity-25',
  alpha30: 'text-opacity-30 dark:text-opacity-30',
  alpha50: 'text-opacity-50 dark:text-opacity-50',
  alpha70: 'text-opacity-70 dark:text-opacity-70',
  alpha90: 'text-opacity-90 dark:text-opacity-90',
}

const ALPHA_30 = 'opacity-30 dark:opacity-30'

const createDefaultClasses = (): BlowRoleViewClasses => ({
  button: [
    'bg-gray-100 dark:bg-gray-900',
    'border-gray-300 dark:border-gray-800',
  ],
  title: ['text-black/30 dark:text-white/30'],
  roleIcon: ['text-black/30 dark:text-white/30'],
  active: {
    text: [TEXT.body, ALPHA_30],
    hint: [TEXT.body, TEXT.alpha20],
    icon: [TEXT.body, TEXT.alpha30],
    coinColor: 'gray',
  },
  counter: {
    text: [TEXT.body, ALPHA_30],
    hint: [TEXT.body, TEXT.alpha20],
    icon: [TEXT.body, TEXT.alpha30],
    coinColor: 'gray',
  },
  separator: ['border-gray-200 dark:border-gray-800'],
})

const withRoleDefaults = (classes?: BlowRoleClasses) => {
  return {
    fg: [
      ...(classes?.text ?? ['text-cyan-600 dark:text-cyan-400']),
      ...(classes?.textMods ?? [
        'text-opacity-90 dark:text-opacity-90',
        'group-hover:text-opacity-100 dark:group-hover:text-opacity-100',
      ]),
    ],
    bg: [
      ...(classes?.bg ?? ['bg-cyan-100 dark:bg-cyan-925']),
      ...(classes?.bgMods ?? [
        'bg-opacity-50 dark:bg-opacity-40',
        'hover:bg-opacity-60 dark:hover:bg-opacity-60',
      ]),
      ...(classes?.borderFocus ?? [
        'focus:border-cyan-700 dark:focus:border-cyan-700',
      ]),
      ...(classes?.ring ?? ['focus:ring-cyan-400 dark:focus:ring-cyan-500']),
      ...(classes?.ringMods ?? [
        'focus:ring-4 focus:ring-opacity-25 dark:focus:ring-opacity-25',
      ]),
    ],
    bgActive: [...(classes?.bgActive ?? ['bg-cyan-500 dark:bg-cyan-400'])],
    border: [
      ...(classes?.border ?? ['border-cyan-500 dark:border-cyan-900']),
      ...(classes?.borderMods ?? [
        'border-opacity-80 dark:border-opacity-80',
        'hover:border-opacity-100 dark:hover:border-opacity-100',
        'group-hover:border-opacity-100 dark:group-hover:border-opacity-100',
      ]),
    ],
  }
}

function isOptions(opts: unknown): opts is GetBlowRoleViewOptions {
  const o = opts as GetBlowRoleViewOptions
  return (
    o.disable != null ||
    o.clickable != null ||
    o.useActionIndex != null ||
    o.useActionID != null
  )
}

export default function getBlowRoleView(
  theme?: BlowThemeID,
  id?: BlowRoleID | null,
  opts?: GetBlowRoleViewOptions
): BlowRoleView
export default function getBlowRoleView(
  theme?: BlowThemeID,
  id?: BlowRoleID | null,
  actionStates?: Partial<Record<BlowRoleActionID, BlowActionState>>,
  opts?: GetBlowRoleViewOptions
): BlowRoleView
export default function getBlowRoleView(
  theme?: BlowThemeID,
  id?: BlowRoleID | null,
  _actionStates:
    | Partial<Record<BlowRoleActionID, BlowActionState>>
    | GetBlowRoleViewOptions = {},
  _opts: GetBlowRoleViewOptions = {}
): BlowRoleView {
  let actionStates = _actionStates as Partial<
    Record<BlowRoleActionID, BlowActionState>
  >
  let opts = _opts

  if (isOptions(_actionStates)) {
    actionStates = {}
    opts = _actionStates
  }

  const { useActionIndex, useActionID, clickable, disable } = opts

  const view: BlowRoleView = { classes: { ...createDefaultClasses() } }

  if (theme && id) {
    view.role = getBlowRole(theme, id)

    const common = view.role.common === true

    const defs = view.role.actions.map(getBlowRoleAction(theme))
    const [actives, counters] = partition((x) => !x.counter, defs)
    invariant(
      common || actives.length < 2,
      'Multiple active actions not supported'
    )
    invariant(
      common || counters.length < 2,
      'Multiple active actions not supported'
    )

    if (useActionIndex != null) {
      const xid = view.role.actions[useActionIndex]
      if (actionStates[xid] === 'clickable') {
        view.clickableID = xid
      }

      view.active = defs[useActionIndex]
    } else if (useActionID) {
      if (actionStates[useActionID] === 'clickable') {
        view.clickableID = useActionID
      }

      view.active = defs.find((x) => x.id === useActionID)
    } else {
      view.clickableID = view.role.actions.find(
        (x) => actionStates[x] === 'clickable'
      )

      view.active = actives[0]
      view.counter = counters[0]
    }

    if (disable) return view

    let active = false
    if (useActionIndex != null) {
      active = actionStates[view.role.actions[useActionIndex]] === 'active'
    } else if (useActionID != null) {
      active = actionStates[useActionID] === 'active'
    } else {
      active =
        view.role.actions.find((x) => actionStates[x] === 'active') != null
    }

    let counter = false
    if (useActionIndex != null) {
      counter = actionStates[view.role.actions[useActionIndex]] === 'counter'
    } else if (useActionID != null) {
      counter = actionStates[useActionID] === 'counter'
    } else {
      counter =
        view.role.actions.find((x) => actionStates[x] === 'counter') != null
    }

    let classes = view.role.classes
    if (useActionIndex != null) {
      const xid = view.role.actions[useActionIndex]
      const x = getBlowRoleAction(theme, xid)
      if (x.classes) classes = x.classes
    } else if (useActionID != null) {
      const x = getBlowRoleAction(theme, useActionID)
      if (x.classes) classes = x.classes
    }
    const roleClasses = withRoleDefaults(classes)

    if (view.clickableID != null || clickable) {
      // Colors when a role's action is currently clickable

      view.classes.button = [
        ...roleClasses.bg,
        ...roleClasses.border,
        'transition cursor-pointer',
      ]
      view.classes.title = [TEXT.body, TEXT.alpha90]
      view.classes.roleIcon = roleClasses.fg

      const activeClickable = view.clickableID === view.active?.id
      const litKey = activeClickable ? 'active' : 'counter'
      const dimKey = activeClickable ? 'counter' : 'active'

      view.classes[litKey].text = [TEXT.body, TEXT.alpha70]
      view.classes[litKey].coinColor = 'body'
      view.classes[litKey].icon = [TEXT.body, TEXT.alpha50]

      const textAlpha = clickable ? TEXT.alpha70 : ALPHA_30
      const iconAlpha = clickable ? TEXT.alpha50 : TEXT.alpha25
      view.classes[dimKey].text = [TEXT.body, textAlpha]
      view.classes[dimKey].coinColor = 'body'
      view.classes[dimKey].icon = [TEXT.body, iconAlpha]

      view.classes.separator = roleClasses.border
    } else if (active || counter) {
      // Colors when a role's action is the turn's active or counter action

      view.classes.button = [...roleClasses.bgActive, 'border-transparent']
      view.classes.title = [TEXT.black, TEXT.alpha70]
      view.classes.roleIcon = [TEXT.black, TEXT.alpha70]

      view.classes.active = getActiveRoleAction(active, roleClasses)
      view.classes.counter = getActiveRoleAction(counter, roleClasses)

      view.classes.separator = ['border-black/25 dark:border-black/10']
    }

    return view
  }

  return view
}

function getActiveRoleAction(
  lit: boolean,
  roleClasses: RoleViewClasses
): BlowRoleViewActionClasses {
  if (lit) {
    return {
      text: [TEXT.black, TEXT.alpha70],
      coinColor: roleClasses.fg,
      icon: [TEXT.black, TEXT.alpha70],
      hint: [TEXT.black, TEXT.alpha25],
    }
  } else {
    return {
      text: [TEXT.black, 'opacity-30 dark:opacity-30'],
      coinColor: roleClasses.fg,
      icon: [TEXT.black, TEXT.alpha70],
      hint: [TEXT.black, TEXT.alpha25],
    }
  }
}