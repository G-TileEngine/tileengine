export type BuildView = "idle" | "busy";
export function buildButton(view: BuildView): string {
  if (view === "busy") return `<button type="button" class="btn ghost stage-row" data-act="build" disabled aria-busy="true"><span class="spin"></span>Building…</button>`;
  return `<button type="button" class="btn ghost stage-row" data-act="build">Build game</button>`;
}
