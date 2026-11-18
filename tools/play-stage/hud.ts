import { HUD_TOP, PLATE_H, ROW_FOOT } from "./board.ts";
export type HudView = {
  readonly turn: string; readonly side: string; readonly name: string; readonly hp: number; readonly max: number; readonly selected: boolean;
  readonly outcome: "win" | "lose" | "draw" | null; readonly turns: number; readonly talk: { readonly name: string; readonly text: string } | null;
  readonly actions: { readonly basic: Btn; readonly spell: Btn; readonly talk: Btn; readonly wait: Btn; readonly end: Btn };
};
type Btn = { readonly show: boolean; readonly on: boolean };
type Act = { choose(kind: "basic" | "spell" | "talk"): void; wait(): void; endTurn(): void; restart(): void; menu(): void; recentre(): void; closeTalk(): void };
const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#recentre{width:48px;height:48px;flex:none}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#sheet{position:absolute;left:8px;right:8px;bottom:${ROW_FOOT + PLATE_H}px;max-height:35%;box-sizing:border-box;display:none;overflow:auto;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px;pointer-events:auto;font-size:16px}#sheet b{display:block}#sheet button{width:48px;height:48px}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}`;
export function createHud(act: Act): { hideBanner(): void; render(view: HudView): void } {
  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="recentre" type="button">Recentre</button><button id="menu" type="button">Menu</button></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="sheet"><b></b><span></span><button id="close" type="button">Close</button></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
  document.body.append(root);
  const q = (id: string): HTMLElement => { const n = root.querySelector(`#${id}`); if (!(n instanceof HTMLElement)) throw new Error(id); return n; };
  const banner = q("banner"), veil = q("veil"), sheet = q("sheet");
  const buttons: Record<"basic" | "spell" | "talk" | "wait" | "end", HTMLElement> = { basic: q("attack"), spell: q("spell"), talk: q("talk"), wait: q("wait"), end: q("end") };
  let held = true;
  const hideBanner = (): void => { held = false; banner.style.display = "none"; };
  banner.addEventListener("click", hideBanner); q("menu").addEventListener("click", () => act.menu());
  q("attack").addEventListener("click", () => act.choose("basic")); q("spell").addEventListener("click", () => act.choose("spell"));
  q("talk").addEventListener("click", () => act.choose("talk")); q("wait").addEventListener("click", () => act.wait()); q("end").addEventListener("click", () => act.endTurn());
  q("recentre").addEventListener("click", () => act.recentre()); q("close").addEventListener("click", () => act.closeTalk());
  q("restart").addEventListener("click", () => act.restart()); q("back").addEventListener("click", () => act.restart());
  window.setTimeout(hideBanner, 1260);
  const render = (view: HudView): void => {
    q("pill").textContent = view.turn; banner.textContent = view.turn; banner.style.background = view.side === "player" ? "#14213d" : "#6b1d2a";
    q("plate").style.display = view.selected ? "flex" : "none"; q("who").textContent = view.name; q("hpText").textContent = `${view.hp}/${view.max}`;
    const bar = q("hp").querySelector("i"); if (bar instanceof HTMLElement) bar.style.width = `${view.max <= 0 ? 0 : Math.max(0, Math.min(120, Math.round((120 * view.hp) / view.max)))}px`;
    q("end").style.outlineColor = view.side === "player" ? "#2f6fad" : "#b23b32";
    for (const key of ["basic", "spell", "talk", "wait", "end"] as const) { const b = buttons[key], row = view.actions[key]; b.style.display = row.show ? "block" : "none"; b.style.opacity = row.on ? "1" : "0.4"; }
    const said = view.talk; sheet.style.display = said === null ? "none" : "block"; if (said !== null) { const name = sheet.querySelector("b"), text = sheet.querySelector("span"); if (name !== null) name.textContent = said.name; if (text !== null) text.textContent = said.text === "" ? "…" : said.text; }
    const over = view.outcome !== null; veil.style.display = over ? "flex" : "none";
    const title = q("card").querySelector("h2"), blurb = q("card").querySelector("p");
    if (over && title !== null && blurb !== null) { title.textContent = view.outcome === "win" ? "Victory" : view.outcome === "lose" ? "Defeat" : "Draw"; blurb.textContent = view.outcome === "lose" ? "Your units fell" : "All enemies defeated"; q("turns").textContent = `${view.turns} turns`; }
    if (!held) banner.style.display = "none";
  };
  return { hideBanner, render };
}
