export const MAX_SIDE = 4096;
export const fits = (w        , h        )          => w >= 1 && h >= 1 && w <= MAX_SIDE && h <= MAX_SIDE;
                                                                                                                                                                             
const u16 = (b            , i        )         => ((b[i] ?? 0) << 8) | (b[i + 1] ?? 0), u32 = (b            , i        )         => ((u16(b, i) << 16) | u16(b, i + 2)) >>> 0, le = (b            , i        )         => (b[i] ?? 0) | ((b[i + 1] ?? 0) << 8), text = (b            , i        , n        )         => String.fromCharCode(...b.subarray(i, i + n));
function jpg(b            )          {
  let i = 2;
  while (i + 1 < b.length) {
    if (b[i] !== 0xff) return { ok: false, sniffed: "damaged jpg" };
    while (i < b.length && b[i] === 0xff) i += 1;
    const m = b[i] ?? 0; i += 1; if (m === 0x01 || m === 0xd8 || m === 0xd9 || (m >= 0xd0 && m <= 0xd7)) continue;
    const len = i + 1 < b.length ? u16(b, i) : 0; if (len < 2 || i + len > b.length) return { ok: false, sniffed: "damaged jpg" };
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return len < 7 ? { ok: false, sniffed: "damaged jpg" } : { ok: true, ext: "jpg", h: u16(b, i + 3), w: u16(b, i + 5) };
    i += len;
  }
  return { ok: false, sniffed: "damaged jpg" };
}
function webp(b            )          {
  if (b.length < 30) return { ok: false, sniffed: "damaged webp" };
  const chunk = text(b, 12, 4), p = 20, b1 = b[p + 1] ?? 0, b2 = b[p + 2] ?? 0, b3 = b[p + 3] ?? 0, b4 = b[p + 4] ?? 0;
  if (chunk === "VP8 ") return { ok: true, ext: "webp", w: le(b, p + 6) & 0x3fff, h: le(b, p + 8) & 0x3fff };
  if (chunk === "VP8L") return b[p] === 0x2f ? { ok: true, ext: "webp", w: 1 + b1 + ((b2 & 0x3f) << 8), h: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10) } : { ok: false, sniffed: "damaged webp" };
  if (chunk === "VP8X") return { ok: true, ext: "webp", w: 1 + (b[p + 4] ?? 0) + ((b[p + 5] ?? 0) << 8) + ((b[p + 6] ?? 0) << 16), h: 1 + (b[p + 7] ?? 0) + ((b[p + 8] ?? 0) << 8) + ((b[p + 9] ?? 0) << 16) };
  return { ok: false, sniffed: "damaged webp" };
}
function other(b            )         {
  const head = text(b, 0, Math.min(b.length, 256)), brand = b.length >= 12 && text(b, 4, 4) === "ftyp" ? text(b, 8, 4) : "";
  if (head.startsWith("GIF")) return "gif"; if (head.startsWith("BM")) return "bmp"; if (head.includes("<svg")) return "svg";
  if (brand.startsWith("hei") || brand === "mif1" || brand === "msf1") return "heic"; if (brand === "avif" || brand === "avis") return "avif"; return "unknown";
}
export function readPicture(bytes            )          {
  if (bytes.length >= 8 && u32(bytes, 0) === 0x89504e47 && u32(bytes, 4) === 0x0d0a1a0a) return bytes.length < 24 || text(bytes, 12, 4) !== "IHDR" ? { ok: false, sniffed: "damaged png" } : { ok: true, ext: "png", w: u32(bytes, 16), h: u32(bytes, 20) };
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return jpg(bytes);
  if (bytes.length >= 12 && text(bytes, 0, 4) === "RIFF" && text(bytes, 8, 4) === "WEBP") return webp(bytes);
  return { ok: false, sniffed: other(bytes) };
}
