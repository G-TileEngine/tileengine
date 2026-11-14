import type { DrawList, Fit, FrameStamp, Renderer } from "./types.ts";

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
  try {
    for (const cmd of list.cmds) renderer.drawImage(cmd.sheet, cmd.sx, cmd.sy, cmd.sw, cmd.sh, cmd.dx, cmd.dy, cmd.dw, cmd.dh, cmd.op, cmd.flipX);
    after?.();
  } finally { renderer.endFrame(); }
}
