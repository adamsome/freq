type El = Window | Document | HTMLElement | EventTarget

type Args<T extends El> =
  | Parameters<T['addEventListener']>
  // eslint-disable-next-line @typescript-eslint/ban-types
  | [string, Function | null, ...unknown[]]

export function on<T extends El>(obj: T | null, ...args: Args<T>): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(
      ...(args as Parameters<HTMLElement['addEventListener']>)
    )
  }
}

export function off<T extends El>(obj: T | null, ...args: Args<T>): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(
      ...(args as Parameters<HTMLElement['removeEventListener']>)
    )
  }
}
