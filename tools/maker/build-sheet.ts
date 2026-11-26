export type BuildView = "idle" | "busy";
export function buildButton(view: BuildView): string {
  if (view === "busy") return `<button type="button" class="btn ghost stage-row" data-act="build" disabled aria-busy="true"><span class="spin"></span>Building…</button>`;
  return `<button type="button" class="btn ghost stage-row" data-act="build">Build game</button>`;
}
export type BuildSheet = { readonly mode: "ready"; readonly file: string; readonly share: boolean } | { readonly mode: "error"; readonly reason: string } | null;
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : ch === '"' ? "&quot;" : "&#39;");
const sheet = (title: string, body: string, buttons: string): string => `<div class="scrim" data-sheet="build"><div class="sheet" role="dialog"><h2>${title}</h2><p>${body}</p>${buttons}<button type="button" class="btn ghost" data-act="build:done">Done</button></div></div>`;
export function buildSheet(view: BuildSheet): string {
  if (view === null) return "";
  if (view.mode === "error") return sheet("Couldn't build your game", esc(view.reason), `<button type="button" class="btn" data-act="build">Try again</button>`);
  const share = view.share ? `<button type="button" class="btn" data-act="build:share">Share</button>` : "";
  return sheet("Your game is ready", `Saved to Downloads as ${esc(view.file)}. This is a web build: put it on any website host that takes HTML games, and anyone can play it in a browser. A phone app version comes in a later update.`, share);
}
