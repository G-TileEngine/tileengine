#!/usr/bin/env python3
"""Capture Effect Designer v3 mock screens + touch/contrast audit.
Headless Chromium via Playwright (Python). Phone 390x844, DPR 2, has_touch, is_mobile.
Opens index.html straight from file:// to prove the folder is self-contained.
Run: python3 scripts/capture.py   (needs `pip install playwright`; uses system Chrome if present)"""
from pathlib import Path
import json, os, sys
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SHOTS = ROOT / "shots"; SHOTS.mkdir(exist_ok=True)
URL = (ROOT / "index.html").as_uri()
CHROME = "/usr/bin/google-chrome" if os.path.exists("/usr/bin/google-chrome") else None

AUDIT_JS = r"""
(label) => {
  const vw = innerWidth, vh = innerHeight;
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const over = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
  const visible = el => {
    if (!el.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true })) return null;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return null;
    if (r.right <= 0 || r.bottom <= 0 || r.left >= vw || r.top >= vh) return null;
    for (let p = el.parentElement; p; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (/(auto|scroll|hidden)/.test(cs.overflowX + cs.overflowY)) { const pr = p.getBoundingClientRect(); if (r.right <= pr.left + 1 || r.left >= pr.right - 1 || r.bottom <= pr.top + 1 || r.top >= pr.bottom - 1) return null; }
    }
    return r;
  };
  const name = el => (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
  const targets = [], tFail = [];
  document.querySelectorAll('button, input, a[href], [role=button], [role=switch]').forEach(el => {
    const r = visible(el); if (!r) return;
    const t = { name: name(el), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 };
    targets.push(t); if (r.width < 47.5 || r.height < 47.5) tFail.push(t);
  });
  const bgOf = el => {
    const stack = [];
    for (let p = el; p; p = p.parentElement) {
      const cs = getComputedStyle(p); let c = parse(cs.backgroundColor);
      if ((!c || c[3] === 0) && cs.backgroundImage.includes('gradient')) { const m = cs.backgroundImage.match(/rgba?\([^)]+\)/); if (m) c = parse(m[0]); }
      if (c && c[3] > 0) { stack.push(c); if (c[3] >= 1) break; }
    }
    let base = [255, 255, 255, 1]; for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base); return base;
  };
  const texts = [], cFail = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const n = walker.currentNode; if (!n.textContent.trim()) continue; const el = n.parentElement; if (seen.has(el)) continue; seen.add(el);
    if (!visible(el)) continue;
    const cs = getComputedStyle(el); let fg = parse(cs.color);
    let op = 1; for (let p = el; p; p = p.parentElement) op *= +getComputedStyle(p).opacity;
    const bg = bgOf(el); fg = over([fg[0], fg[1], fg[2], fg[3] * op], bg);
    const size = parseFloat(cs.fontSize), wt = +cs.fontWeight;
    const large = size >= 24 || (size >= 18.66 && wt >= 700);
    const need = large ? 3 : 4.5, rr = ratio(fg, bg);
    const t = { text: n.textContent.trim().slice(0, 40), ratio: Math.round(rr * 100) / 100, need };
    texts.push(t); if (rr < need) cFail.push(t);
  }
  return { state: label, theme: document.documentElement.dataset.theme, viewport: vw + 'x' + vh, targets: targets.length, targetFails: tFail, texts: texts.length, contrastFails: cFail,
    minTarget: targets.reduce((m, t) => Math.min(m, t.w, t.h), 999), minContrast: texts.reduce((m, t) => Math.min(m, t.ratio), 99) };
}
"""

def main():
    audits, shots, errs = [], [], []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME) if CHROME else p.chromium.launch()

        def new_page(w=390, hgt=844, mobile=True):
            ctx = b.new_context(viewport={"width": w, "height": hgt}, device_scale_factor=2, has_touch=True, is_mobile=mobile)
            pg = ctx.new_page()
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
            pg.on("request", lambda r: (not r.url.startswith("file:") and not r.url.startswith("data:")) and errs.append("NETWORK " + r.url))
            return pg

        def fresh(pg, theme="light", query=""):
            pg.goto(URL + query); pg.wait_for_function("window.__fx && window.__fx.ready === true")
            pg.evaluate(f"__fx.setTheme('{theme}')"); pg.wait_for_timeout(120)

        def sheet_h(pg, label=""):
            box = pg.evaluate("__fx.sheetBox()")
            print("SHEET", label, box)
            return box

        def shot(pg, name, caption, audit=True, hide_toast=True):
            pg.wait_for_timeout(260)
            if hide_toast: pg.evaluate("document.getElementById('toast').hidden = true")
            path = SHOTS / f"{name}.png"
            pg.screenshot(path=str(path))
            shots.append({"file": f"shots/{name}.png", "caption": caption}); print("wrote", path.name)
            if audit:
                audits.append(pg.evaluate(AUDIT_JS, name))

        def scroll_grid(pg, sel="#grid"):
            pg.evaluate(f"(() => {{ const b = document.getElementById('body'); const g = document.querySelector('{sel}'); b.scrollTop += g.getBoundingClientRect().top - b.getBoundingClientRect().top - 4; }})()")
            pg.wait_for_timeout(120)

        def center(pg, css):
            bb = pg.locator(css).first.bounding_box(); return bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2 - 20

        def touch(pg):
            return pg.context.new_cdp_session(pg)

        def tdrag(pg, cdp, x0, y0, x1, y1, steps=12, hold=520, finish=True):
            cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x0, "y": y0}]})
            pg.wait_for_timeout(hold)
            for i in range(1, steps + 1):
                f = i / steps
                cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x0 + (x1 - x0) * f, "y": y0 + (y1 - y0) * f}]})
                pg.wait_for_timeout(16)
            if finish:
                cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})

        for theme in ["light", "dark"]:
            sfx = "" if theme == "light" else "-dark"
            pg = new_page()
            # 01 home
            fresh(pg, theme); pg.evaluate("__fx.freezeAt('hit', .3)")
            shot(pg, f"01-home{sfx}", "Home: Basic, Slash pre-picked from Cleave, live preset grid; Save & use is the 3-tap path.")
            # 02 layer selected
            pg.evaluate("__fx.selLayer('sparks')"); pg.evaluate("__fx.freezeAt('hit', .45)")
            shot(pg, f"02-layer-sparks{sfx}", "A layer selected: only the Sparks layer's 3 sliders show, plus Take from / Roll this layer / Shelf it.")
            if theme == "light":
                # 03 beat row (Advanced) on a shot with a travel path
                fresh(pg, theme); pg.evaluate("__fx.useCard('frost-shard'); __fx.setMode('adv'); __fx.selBeat('travel'); __fx.freezeAt('travel', .5)")
                shot(pg, "03-beat-row-travel", "Advanced beat row (Cast · Travel · Hit · Linger). Travel shows a still path: 'Travel arrives in a later update'.")
                pg.evaluate("__fx.selBeat('hit'); __fx.freezeAt('hit', .3)")
                shot(pg, "03b-beat-hit-sheet", "Hit beat sheet: take this beat from another effect, nudge ±30 ms, start here, tap the rhythm.")
            # 04/05 drag merge (real touch events via CDP)
            fresh(pg, theme); pg.evaluate("__fx.setKind('All'); __fx.useCard('fireball'); __fx.freezeAt('hit', .3)"); scroll_grid(pg)
            cdp = touch(pg)
            x0, y0 = center(pg, '.card[data-id="frost-shard"]'); x1, y1 = center(pg, '.card[data-id="fireball"]')
            tdrag(pg, cdp, x0, y0, x1, y1, finish=False)
            if theme == "light":
                shot(pg, "04-drag-merge-mid", "Mid-drag (touch): hold Frost shard, drag it onto Fireball; the target says 'Drop to blend'.")
            cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
            pg.wait_for_timeout(200); pg.evaluate("__fx.freezeAt('hit', .3)")
            shot(pg, f"05-blend-card{sfx}", "Default blend sheet: parent row with a leads marker and Swap, a Mix slider that snaps to 0/25/50/75/100, a slim Steam Try line, and Fine-tune parts. Per-part A/B/Both is not on this sheet.")
            sheet_h(pg, f"05-default{sfx}")
            if theme == "dark":
                pg.evaluate("__fx.openSheet('blend', 'fine')")
                pg.evaluate("document.getElementById('toast').hidden = true")
                shot(pg, "05c-blend-fine-tune-dark", "Fine-tune parts, dark: the same framed A/B/Both control and inset selected pill, with 8 px gaps and all six rows on-screen.")
                sheet_h(pg, "05c-fine-dark")
            if theme == "light":
                pg.evaluate("document.getElementById('body').scrollTop = 0")
                pg.evaluate("document.getElementById('toast').hidden = true")
                pg.evaluate("__fx.openSheet('blend', 'fine')")
                shot(pg, "05c-blend-fine-tune", "Fine-tune parts: framed A/B/Both with an inset selected pill (~4 px padding) and 8 px gaps between rows; all six parts fit; Layer/Beat uses the same pill.")
                sheet_h(pg, "05c-fine")
                pg.evaluate("__fx.openSheet('blend')")
                pg.evaluate("__fx.openPickPop('colour')")
                pg.evaluate("document.getElementById('toast').hidden = true")
                shot(pg, "05d-blend-chip-pop", "While blending, tapping the Colour chip opens a small A/B/Both popover with a live preview. The default blend sheet stays open.")
                pg.evaluate("__fx.closePickPop()")
                pg.evaluate("__fx.editBlend(x => { x.pick.shape = 'Both'; x.pick.trail = 'Both'; })")
                pg.evaluate("document.getElementById('toast').hidden = true")
                shot(pg, "06a-over-budget", "Shape and Trail set to Both: the meter turns amber, names the overflow, and offers one-tap 'Fit to budget'.")
                pg.click("#btn-fit")
                shot(pg, "06b-fit-trimmed", hide_toast=True, caption="After Fit (rule 4): one line says “Trimmed 2 linger steps, trail by 2 to fit” with Undo. Particles were already in cap and were not cut by step. Never silent.")
                # 07 long-press take menu (touch)
                fresh(pg, theme); pg.evaluate("__fx.setKind('All'); __fx.freezeAt('hit', .3)"); scroll_grid(pg)
                cdp = touch(pg); x, y = center(pg, '.card[data-id="thunder"]')
                tdrag(pg, cdp, x, y, x, y, steps=1, hold=560)
                shot(pg, "07-take-menu", "Long-press Thunder pillar: Take its sparks / colour / motion / timing, Blend into current, Shelf it.")
                # 08 provenance
                fresh(pg, theme); pg.evaluate("__fx.take('fireball', 'sparks'); __fx.selLayer('sparks'); __fx.freezeAt('hit', .45)")
                shot(pg, "08a-prov-from", "Taken layer keeps an origin chip: 'from Fireball'. It is a copy; nothing updates on its own.")
                pg.evaluate("__fx.mockEditSource('fireball'); __fx.selLayer('sparks')")
                shot(pg, "08b-prov-changed", "Source edited: the chip reads 'Fireball changed · Update?' and the layer chip gets an amber dot. One tap pulls it, one Undo.")
                pg.evaluate("__fx.S.removed.fireball = true; __fx.renderAll(); __fx.selLayer('sparks')")
                shot(pg, "08c-prov-removed", "Source deleted: 'source removed'. The effect keeps its own copy and still plays.")
                # 09 shelf
                fresh(pg, theme)
                pg.evaluate("['fireball','frost-shard','holy-cross','thunder','mend'].forEach(id => __fx.toggleShelf(id))")
                pg.evaluate("__fx.selLayer('colour')"); pg.click("text=♡ Shelf it")
                pg.evaluate("__fx.openSheet('shelf')"); pg.locator('#sheet .scard').nth(1).click()
                pg.evaluate("__fx.freezeAt('hit', .3)")
                shot(pg, "09-shelf", "Shelf (references only, 6 of 48, this project): hearted effects and a one-part Colour layer with from pointing at its source. Liking is not using.")
                # 10 dice history
                fresh(pg, theme)
                for _ in range(5): pg.click("#btn-dice"); pg.wait_for_timeout(60)
                pg.evaluate("__fx.freezeAt('hit', .35)")
                shot(pg, "10-dice-history", "Variation dice: seeded rerolls inside the layers' bounds; last 6 rolls on this device, tap one to step back.")
                # 11 house style — Fireball + motes is 34 of the 32 preset particle cap
                fresh(pg, theme); pg.evaluate("__fx.useCard('fireball'); __fx.setKind('All'); __fx.openSheet('house')")
                pg.click("#sheet button.chip-btn:has-text('Moonlit')"); pg.click("#sheet >> text=Chunky"); pg.click("#sheet [aria-label='Motes']")
                pg.evaluate("__fx.freezeAt('hit', .4)")
                shot(pg, "11-house-style", "House style on Fireball: Moonlit @4 fire (no pink), chunky, motes. Particle meter reads 34/32 particles (preset cap) on one line with draws and steps, goes amber and offers Fit.")
                pg.click("#btn-fit")
                shot(pg, "11b-house-motes-fit", hide_toast=True, caption="After Fit on the same Fireball: “Trimmed particles 34→32 to fit” with Undo. The preset cap holds.")
                # 12 lab
                fresh(pg, theme); pg.evaluate("__fx.useCard('fireball'); __fx.openSheet('lab'); __fx.freezeAt('hit', .3)")
                shot(pg, "12-lab", "Lab: bold ideas with a live budget pill each (fits / over → Fit). World-aware linger and Draw the spell marked later.")
                pg.evaluate("document.querySelector('#sheet .sheet-body').scrollTop = 400"); pg.wait_for_timeout(100)
                shot(pg, "12b-lab-lower", "Lab, lower half: tiers, reactions, combo fusion, living linger, later ideas.")
                # 13 breed
                fresh(pg, theme); pg.evaluate("__fx.useCard('fireball'); __fx.toggleShelf('frost-shard'); __fx.openSheet('breed'); __fx.freezeAt('hit', .3)")
                shot(pg, "13-breed", "Breed Fireball × Frost shard: 6 children, 3 at a time; each flips one or two discrete picks (kind, picture or ramp) from variant_seed so they look clearly different.")
                # 14 fusion
                fresh(pg, theme); pg.evaluate("__fx.useCard('fireball'); __fx.S.doc.exp.fusion = true; __fx.renderAll(); __fx.freezeAt('hit', .35)")
                shot(pg, "14-combo-fusion", "Combo fusion preview: two casters, and at the hit a ready-made fused look (Steam burst) swaps in. Not a live blend.")
                # 15 living linger over budget
                fresh(pg, theme); pg.evaluate("__fx.useCard('fireball'); __fx.S.doc.exp.living = true; __fx.S.doc.exp.livingTiles = 4; __fx.renderAll(); __fx.freezeAt('linger', .55)")
                shot(pg, "15-living-linger-over", "Living linger (visual only) spreads to 4 tiles and goes over 60 draws: flagged, with Fit to budget.")
                # 16 tiers: show Lv3 flagged at 13 steps, then fitted to ≤12
                fresh(pg, theme); pg.evaluate("__fx.useCard('fireball'); __fx.S.doc.exp.tier = 2; __fx.renderAll(); __fx.freezeAt('hit', .35)")
                shot(pg, "16-tier-lv3", "Power-up tier Lv3 of Fireball: extra steps switch on, 13/12 steps is flagged on the one-line meter and Fit is offered. Later: value scaling. Save is refused while over.")
                pg.click("#btn-fit")
                shot(pg, "16b-tier-lv3-fit", hide_toast=True, caption="After Fit: “Trimmed 1 linger step to fit” with Undo. The meter reads 11/12 steps, so Lv3 can never save at 13.")
                # 17 export
                fresh(pg, theme); pg.evaluate("__fx.useCard('fire-slash'); __fx.take('fireball','sparks'); __fx.openSheet('export')"); pg.click("#sheet [aria-label='Export clean']")
                pg.evaluate("__fx.freezeAt('hit', .3)")
                shot(pg, "17-export-clean", "Export: 8-frame sprite sheet, GIF later; 'Export clean' drops the 'from' links, the look stays.")
                # 18 rhythm
                fresh(pg, theme); pg.evaluate("__fx.useCard('frost-shard'); __fx.setMode('adv'); __fx.applyRhythm([0, 300, 560, 900, 1500]); __fx.openSheet('rhythm'); __fx.freezeAt('hit', .3)")
                shot(pg, "18-tap-rhythm", "Tap the rhythm (Advanced): five taps set the beat lengths, snapped to 30 ms; the beat row shows the nudges.")
            # Variant B: chips-only blend (?blend=chips), with the one-time coach mark
            fresh(pg, theme, "?blend=chips")
            pg.evaluate("__fx.setKind('All'); __fx.makeBlend('fireball', 'frost-shard'); __fx.freezeAt('hit', .3)")
            pg.evaluate("document.getElementById('toast').hidden = true")
            shot(pg, f"05v-blend-chips{sfx}", "Variant B (URL ?blend=chips): same Mix and parents, no Fine-tune row; the top chips are the only per-part control. One-time coach: “Tap a part to pick A, B or Both”.")
            sheet_h(pg, f"05v-chips{sfx}")
            pg.context.close()

        # PC and tablet
        for (w, hgt, name, cap) in [(1280, 800, "30-pc-1280x800", "PC 1280×800: same pieces in two panes; preview, layers, beats and sheet on the left, library on the right."),
                                   (820, 1180, "31-tablet-820x1180", "Tablet 820×1180: two panes, blend card docked under the controls.")]:
            pg = new_page(w, hgt, mobile=False)
            fresh(pg, "light"); pg.evaluate("__fx.setKind('All'); __fx.setMode('adv'); __fx.toggleShelf('frost-shard'); __fx.toggleShelf('holy-cross'); __fx.makeBlend('fireball', 'frost-shard'); __fx.freezeAt('hit', .3)")
            pg.evaluate("document.getElementById('toast').hidden = true")
            shot(pg, name, cap)
            pg.context.close()
        b.close()

    report = {"tool": "scripts/capture.py", "rule": "every visible button/input >= 48x48 CSS px; text contrast >= 4.5:1 (3:1 for large text), opacity and translucent layers composited",
              "states": audits,
              "summary": {"states": len(audits), "targetsChecked": sum(a["targets"] for a in audits), "textsChecked": sum(a["texts"] for a in audits),
                          "targetFails": sum(len(a["targetFails"]) for a in audits), "contrastFails": sum(len(a["contrastFails"]) for a in audits),
                          "minTarget": min(a["minTarget"] for a in audits), "minContrast": min(a["minContrast"] for a in audits)},
              "errors": errs}
    (SHOTS / "touch-audit.json").write_text(json.dumps(report, indent=1))
    (SHOTS / "shots.json").write_text(json.dumps(shots, indent=1))
    print("SUMMARY", json.dumps(report["summary"]))
    print("ERRORS:", "none" if not errs else errs[:10])

if __name__ == "__main__":
    main()
