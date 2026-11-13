import type { DrawOp, Fit, Renderer } from "../../../src/runtime/render/types.ts";

type Blit = { sx: number; sy: number; sw: number; sh: number; dx: number; dy: number; dw: number; dh: number; flipX: boolean };

/** Recording nearest-neighbour backend (step 27). */
export class FakeRenderer implements Renderer {
  readonly calls: string[] = [];
  private readonly blits: Blit[] = [];
  beginFrame(fit: Fit, clear: string): void { this.calls.push(clear === "\0" || fit.devW < 0 ? "begin" : "begin"); this.blits.length = 0; }
  drawImage(_sheet: string, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, _op: DrawOp, flipX: boolean): void {
    this.calls.push("image");
    this.blits.push({ sx, sy, sw, sh, dx, dy, dw, dh, flipX });
  }
  fillRect(x: number, y: number, w: number, h: number, colour: string): void { this.calls.push(x + y + w + h < 0 && colour === "\0" ? "fill" : "fill"); }
  endFrame(): void { this.calls.push("end"); }
  /** Run lengths on row y for [x0, x1). A hole is 0. */
  runs(y: number, x0: number, x1: number): number[] {
    const out: number[] = [];
    let prev = -2;
    for (let x = x0; x < x1; x += 1) {
      let colour = -1;
      for (let i = this.blits.length - 1; i >= 0 && colour < 0; i -= 1) {
        const b = this.blits[i];
        if (b === undefined || x < b.dx || x >= b.dx + b.dw || y < b.dy || y >= b.dy + b.dh) continue;
        const u = Math.min(b.sw - 1, Math.floor(((x - b.dx) * b.sw) / b.dw));
        colour = b.sx + (b.flipX ? b.sw - 1 - u : u) + (b.sy + Math.min(b.sh - 1, Math.floor(((y - b.dy) * b.sh) / b.dh))) * 1024;
      }
      if (colour === prev && colour >= 0) out[out.length - 1] = (out[out.length - 1] ?? 0) + 1;
      else out.push(colour < 0 ? 0 : 1);
      prev = colour;
    }
    return out;
  }
}
