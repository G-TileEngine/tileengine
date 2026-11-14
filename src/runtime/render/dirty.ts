import type { DrawCmd, DrawList, Fit, FrameStamp, Renderer } from "./types.ts";

export function needsDraw(prev: FrameStamp | null, prevDueMs: number, next: FrameStamp): boolean {
  if (prev === null) return true;
  if (prev.rev !== next.rev) return true;
  if (prev.s !== next.s || prev.devW !== next.devW || prev.devH !== next.devH) return true;
  if (prev.camDevX !== next.camDevX || prev.camDevY !== next.camDevY) return true;
  if (next.tMs < prev.tMs) return true;
  return next.tMs >= prevDueMs;
}

export function present(renderer: Renderer, fit: Fit, list: DrawList, clear: string, after?: () => void): void {
  renderer.beginFrame(fit, clear);
  const draw = (c: DrawCmd): void => { if (c.rects !== undefined) { const colour = c.colour ?? "#000000"; if (renderer.fillRects !== undefined) renderer.fillRects(c.rects, colour); else for (let i = 0; i < c.rects.length; i += 4) renderer.fillRect(c.rects[i] ?? 0, c.rects[i + 1] ?? 0, c.rects[i + 2] ?? 0, c.rects[i + 3] ?? 0, colour); return; } renderer.drawImage(c.sheet, c.sx, c.sy, c.sw, c.sh, c.dx, c.dy, c.dw, c.dh, c.op, c.flipX); };
  try {
    const held: DrawCmd[] = []; let i = 0;
    for (; i < list.cmds.length; i += 1) { const c = list.cmds[i]; if (c === undefined) continue; if (after !== undefined && c.band === "ui") break; if (after !== undefined && c.selfLit === true) held.push(c); else draw(c); }
    after?.();
    if (after !== undefined) { for (const c of held) draw(c); for (; i < list.cmds.length; i += 1) { const c = list.cmds[i]; if (c !== undefined) draw(c); } }
  } finally { renderer.endFrame(); }
}
