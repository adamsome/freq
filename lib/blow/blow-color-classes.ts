import { BlowRoleClasses } from '../types/blow.types'

type ColorCombo =
  | 'orangeTeal'
  | 'purpleBlue'
  | 'yellowRed'
  | 'fuchsiaFuchsia'
  | 'emeraldViolet'
  | 'roseSlate'

export const BLOW_COLOR_COMBOS: Record<ColorCombo, BlowRoleClasses> = {
  orangeTeal: {
    text: ['text-orange-700 dark:text-orange-500'],
    bg: ['bg-teal-100 dark:bg-teal-900'],
    bgActive: ['bg-orange-400 dark:bg-orange-400'],
    border: ['border-teal-500 dark:border-teal-900'],
    shadow: ['shadow shadow-teal-500/50'],
    borderFocus: ['focus:border-orange-700 dark:focus:border-orange-500'],
    ring: ['focus:ring-orange-400 dark:focus:ring-orange-500'],
  },
  purpleBlue: {
    text: ['text-purple-700 dark:text-purple-500'],
    bg: ['bg-blue-100 dark:bg-blue-900'],
    bgActive: ['bg-purple-600 dark:bg-purple-600'],
    border: ['border-blue-500 dark:border-blue-900'],
    shadow: ['shadow shadow-blue-500/50'],
    borderFocus: ['focus:border-purple-700 dark:focus:border-purple-400'],
    ring: ['focus:ring-purple-400 dark:focus:ring-purple-500'],
  },
  yellowRed: {
    text: ['text-yellow-700 dark:text-yellow-300'],
    bg: ['bg-red-200 dark:bg-red-900'],
    bgActive: ['bg-yellow-400 dark:bg-yellow-400'],
    border: ['border-red-500 dark:border-red-900'],
    shadow: ['shadow shadow-red-500/50'],
    borderFocus: ['focus:border-yellow-700 dark:focus:border-yellow-500'],
    ring: ['focus:ring-yellow-400 dark:focus:ring-yellow-500'],
  },
  fuchsiaFuchsia: {
    text: ['text-fuchsia-700 dark:text-fuchsia-300'],
    bg: ['bg-fuchsia-100 dark:bg-fuchsia-900'],
    bgActive: ['bg-fuchsia-400 dark:bg-fuchsia-400'],
    border: ['border-fuchsia-500 dark:border-fuchsia-900'],
    shadow: ['shadow shadow-fuchsia-500/50'],
    borderAlpha: ['border-opacity-80 dark:border-opacity-70'],
    borderAlphaHover: [
      'hover:border-opacity-100 dark:hover:border-opacity-100',
      'group-hover:border-opacity-100 dark:group-hover:border-opacity-100',
    ],
    borderFocus: ['focus:border-fuchsia-700 dark:focus:border-fuchsia-400'],
    ring: ['focus:ring-fuchsia-400 dark:focus:ring-fuchsia-500'],
  },
  emeraldViolet: {
    text: ['text-emerald-700 dark:text-emerald-300'],
    bg: ['bg-violet-100 dark:bg-violet-900'],
    bgActive: ['bg-emerald-400 dark:bg-emerald-400'],
    border: ['border-violet-500 dark:border-violet-900'],
    shadow: ['shadow shadow-violet-500/50'],
    borderFocus: ['focus:border-emerald-700 dark:focus:border-emerald-400'],
    ring: ['focus:ring-emerald-400 dark:focus:ring-emerald-500'],
  },
  roseSlate: {
    text: ['text-rose-700 dark:text-rose-500'],
    bg: ['bg-slate-200 dark:bg-slate-700'],
    bgActive: ['bg-rose-400 dark:bg-rose-400'],
    border: ['border-slate-500 dark:border-slate-700'],
    shadow: ['shadow shadow-slate-500/50'],
    borderFocus: ['focus:border-rose-700 dark:focus:border-rose-500'],
    ring: ['focus:ring-rose-400 dark:focus:ring-rose-500'],
  },
}
