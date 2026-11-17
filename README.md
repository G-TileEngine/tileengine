# TileEngine

TileEngine is a mobile-first, offline-first engine for top-down grid turn-based games.

It is in development. The engine is built step by step by Grok Build from [handoff/steps/](handoff/steps/); [docs/foundation/STATUS.md](docs/foundation/STATUS.md) is the completion record and the source of truth for where it stands.

## Where it stands (Phase 1)

As of main `c913cbd5` (998 tests passing):

- **Merged:** P1-1 walk / movement, P1-2 battle, P1-3 range and interact, P1-4 line-shot, P1-5 enemy turn, P1-6 play page 1, P1-6h hardening, P1-7 play page 2 (camera, HUD, spell door, talk, end turn), and the editor steps ED-E6, ED-E7 and E7p.
- **Next:** P1-8 spell effects (r5 kit: spell effects plus every render feature on the bundled stage). Floor 1007.
- **Then:** P1-9 APK wrapper (play-only Capacitor 6 build). Its go-line is held. Phase 1 work stops at P1-9.

## Run it

Tested on Node 24.22.1 (`.nvmrc` is `24`; `package.json` `engines` is `>=22.18.0`).

```sh
npm ci
npm run green
npm run sim
node tools/serve.ts        # then open http://localhost:8734/tools/play-stage/
```

`npm run green` runs the tests, typecheck, lint, dependency check, and the state and build-law checks. `npm run sim` runs the 50-seed match report. `tools/serve.ts` serves the source tree (optional port argument, default 8734) so the play stage runs in a browser.

## Build it

- **Static play page (Render / gh-pages):** `node tools/play-stage/build.ts <empty folder> [commit]` writes a play-only static build with a `build.json` that names the commit. The checkout must be clean.
- **APK (after P1-9 lands):** `node tools/apk/build.ts --web tools/apk/www`, then `node tools/apk/build.ts --apk`. The APK step needs the Capacitor Android project and SDK on the machine (an ops step, not a builder step).

## Docs

- [docs/foundation/STATUS.md](docs/foundation/STATUS.md) — what is merged, in kit or pending, with test floors
- [BUILD_GUIDE.md](BUILD_GUIDE.md) — how a step is built
- [handoff/README.md](handoff/README.md) — the Grok Build kit
- [docs/core-spine-slices.md](docs/core-spine-slices.md) — the slice plan
