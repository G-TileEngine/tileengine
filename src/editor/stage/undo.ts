export const canUndo = (stack: readonly unknown[]): boolean => stack.length > 0;
export function push<T>(stack: readonly T[], snap: T): T[] { return [...stack, snap]; }
export function pop<T>(stack: readonly T[]): { readonly snap: T; readonly rest: T[] } | null {
  const snap = stack[stack.length - 1];
  return snap === undefined ? null : { snap, rest: stack.slice(0, -1) };
}
