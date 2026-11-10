# TileEngine

TileEngine is a mobile-first, offline-first engine for top-down grid turn-based games.

It is in development. The engine is built step by step by Grok Build from [handoff/steps/](handoff/steps/). Steps 00–10b are merged as of `d9ca13b`.

## Run it

Tested on Node 24.22.1 (`.nvmrc` is `24`; `package.json` `engines` is `>=22.18.0`).

```sh
npm ci
npm run green
npm run sim
```

`npm run green` runs the tests, typecheck, lint, dependency check, and the state and build-law checks. `npm run sim` runs the 50-seed match report.

## Docs

- [BUILD_GUIDE.md](BUILD_GUIDE.md) — how a step is built
- [handoff/README.md](handoff/README.md) — the Grok Build kit
- [docs/core-spine-slices.md](docs/core-spine-slices.md) — the slice plan
