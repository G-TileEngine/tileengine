const u16 = (b: Uint8Array, o: number): number => (b[o] ?? 0) | ((b[o + 1] ?? 0) << 8);
const u32 = (b: Uint8Array, o: number): number => (u16(b, o) | (u16(b, o + 2) << 16)) >>> 0;
const put = (out: Uint8Array, off: number, bits: number, value: number): void => { for (let i = 0; i < bits / 8; i += 1) out[off + i] = (value >>> (8 * i)) & 0xff; };
function concat(parts: readonly Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) at += (out.set(p, at), p.length);
  return out;
}
export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    c ^= data[i] ?? 0;
    for (let k = 0; k < 8; k += 1) c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}
const localFields = (crc: number, size: number, nameLen: number): readonly (readonly [number, number, number])[] => [[4, 16, 20], [6, 16, 0x800], [8, 16, 0], [10, 16, 0], [12, 16, 0], [14, 32, crc], [18, 32, size], [22, 32, size], [26, 16, nameLen], [28, 16, 0]];
const centralFields = (crc: number, size: number, nameLen: number, offset: number): readonly (readonly [number, number, number])[] => [[4, 16, 20], [6, 16, 20], [8, 16, 0x800], [10, 16, 0], [12, 16, 0], [14, 16, 0], [16, 32, crc], [20, 32, size], [24, 32, size], [28, 16, nameLen], [30, 16, 0], [32, 16, 0], [34, 16, 0], [36, 16, 0], [38, 32, 0], [42, 32, offset]];
const endFields = (count: number, size: number, offset: number): readonly (readonly [number, number, number])[] => [[4, 16, 0], [6, 16, 0], [8, 16, count], [10, 16, count], [12, 32, size], [16, 32, offset], [20, 16, 0]];
function header(sig: number, fields: readonly (readonly [number, number, number])[], extra: Uint8Array): Uint8Array {
  const out = new Uint8Array(fields.reduce((n, [off, bits]) => Math.max(n, off + bits / 8), 4) + extra.length);
  put(out, 0, 32, sig);
  for (const [off, bits, value] of fields) put(out, off, bits, value);
  out.set(extra, out.length - extra.length);
  return out;
}
export function zipStore(entries: readonly { readonly name: string; readonly data: Uint8Array }[]): Uint8Array {
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const entry of entries) {
    const name = new TextEncoder().encode(entry.name);
    const local = header(0x04034b50, localFields(crc32(entry.data), entry.data.length, name.length), name);
    locals.push(local, entry.data);
    centrals.push(header(0x02014b50, centralFields(crc32(entry.data), entry.data.length, name.length, offset), name));
    offset += local.length + entry.data.length;
  }
  const cd = concat(centrals);
  return concat([...locals, cd, header(0x06054b50, endFields(entries.length, cd.length, offset), new Uint8Array())]);
}
export function unzipStore(zip: Uint8Array): { name: string; data: Uint8Array }[] {
  let eocd = -1;
  for (let i = zip.length - 22; i >= 0 && eocd < 0; i -= 1) if (u32(zip, i) === 0x06054b50) eocd = i;
  if (eocd < 0) throw new Error("zip: eocd");
  const count = u16(zip, eocd + 10);
  let at = u32(zip, eocd + 16);
  const out: { name: string; data: Uint8Array }[] = [];
  for (let n = 0; n < count; n += 1) {
    if (u32(zip, at) !== 0x02014b50) throw new Error("zip: central");
    if (u16(zip, at + 10) !== 0) throw new Error("zip: method");
    const crc = u32(zip, at + 16);
    const size = u32(zip, at + 24);
    const nameLen = u16(zip, at + 28);
    const extra = u16(zip, at + 30);
    const comment = u16(zip, at + 32);
    const local = u32(zip, at + 42);
    const name = new TextDecoder().decode(zip.slice(at + 46, at + 46 + nameLen));
    const start = local + 30 + u16(zip, local + 26) + u16(zip, local + 28);
    const data = zip.slice(start, start + size);
    if (crc32(data) !== crc) throw new Error("zip: crc");
    out.push({ name, data });
    at += 46 + nameLen + extra + comment;
  }
  return out;
}
