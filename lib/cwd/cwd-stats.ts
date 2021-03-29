import { CwdPlayerStats } from '../../types/cwd.types'

export function createCwdPlayerStats(id: string): CwdPlayerStats {
  return {
    updated_at: new Date().toISOString(),
    id,
    g: 0,
    w: 0,
    pn: 0,
    pp: 0,
    gn: 0,
    gp: 0,
  }
}

export function sumCwdPlayerStats(
  a: CwdPlayerStats,
  b: CwdPlayerStats
): CwdPlayerStats {
  return Object.keys(a).reduce(
    (acc, key) => {
      const k = key as keyof CwdPlayerStats
      if (k !== 'id' && k !== 'updated_at') {
        acc[k] = (a[k] ?? 0) + (b[k] ?? 0)
      }
      return acc
    },
    { id: a.id, updated_at: new Date().toISOString() } as CwdPlayerStats
  )
}

export function calculateCwdPlayerPoints(stats?: CwdPlayerStats): number {
  if (!stats) return 0

  return stats.gp + stats.pp * 2
}
