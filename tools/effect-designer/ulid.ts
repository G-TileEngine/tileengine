export const B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export function ulid(now: number, bytes: Uint8Array): string {
  const t = Math.floor(now); let n = Number.isFinite(t) && t > 0 ? t : 0;
  const time = Array.from({ length: 10 }, () => { const c = B32[n % 32] ?? "0"; n = Math.floor(n / 32); return c; }).reverse().join("");
  return time + [...bytes].map((b) => B32[b % 32] ?? "0").join("");
}
export const minter = (now: () => number, random: (n: number) => Uint8Array) => (prefix: string): string => `${prefix}${ulid(now(), random(16))}`;
