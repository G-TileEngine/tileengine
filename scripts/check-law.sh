#!/bin/sh
# Build-law greps (BUILD_GUIDE §2; QA checklist §3). Independent of ESLint so a disable comment can't hide a hit.
# Usage: sh scripts/check-law.sh [root]   (root defaults to src)
ROOT="${1:-src}"
command -v rg >/dev/null 2>&1 || { echo "check:law: ripgrep (rg) is required" >&2; exit 2; }
fail=0
gate() { # name, rg args...
  name="$1"; shift
  out=$(rg -n -g '*.ts' -g '*.tsx' "$@" "$ROOT" 2>/dev/null)
  if [ -n "$out" ]; then echo "check:law FAIL [$name]:"; echo "$out"; fail=1; fi
}
# One clock: no timer or wall-clock source anywhere in src/.
gate one-clock -e '\b(setInterval|setTimeout|queueMicrotask)\b' -e '\bperformance\.now\b' -e '\bDate\.now\b' -e '\bnew Date\b'
# One frame loop: rAF only in src/runtime/host/raf-driver.ts (glob is relative to the search root, so it is written root-agnostic).
gate one-frame-loop -g '!**/runtime/host/raf-driver.ts' -e '\b(requestAnimationFrame|cancelAnimationFrame)\b'
# Seeded RNG only.
gate seeded-rng -e '\bMath\.random\b' -e '\bcrypto\.getRandomValues\b'
# Offline-first: network only in src/net and src/platform.
gate no-network -g '!**/net/**' -g '!**/platform/**' -e '\b(fetch|WebSocket|XMLHttpRequest|EventSource|RTCPeerConnection)\b' -e 'sendBeacon'
# Storage only in src/platform.
gate no-storage -g '!**/platform/**' -e '\b(localStorage|sessionStorage|indexedDB)\b'
# No lint escapes anywhere in src/ (DSK's core-types.ts included).
gate no-eslint-disable -e 'eslint-disable'
# No BTF/chess trees: nothing may reference the BTF folders.
gate no-btf-path -e 'g-tile-engine' -e 'towerchess'
# Rules never depend on cards: no identifier ending in Card(s)/Deck(s) in src/ (CoreDeck: card-hand presentation and loader only). Cardinal etc. pass.
gate no-card-types -g '!**/types/core-types.ts' -e '\b\w*(Card|Deck)(s|[A-Z]\w*)?\b'
# Core: no game rules (ENGINE.md "Do not") and no phase logic (MODES-v1 M2).
if [ -d "$ROOT/core" ]; then
  out=$(rg -n -i -g '*.ts' -e '\b(hp|maxhp|mana|cost|deck|damage|cards?|phase\w*)\b' "$ROOT/core")
  if [ -n "$out" ]; then echo "check:law FAIL [core-no-rules-no-phase]:"; echo "$out"; fail=1; fi
  out=$(rg -n -g '*.ts' -e 'from\s+["\x27][^"\x27]*/(state|rules|project|runtime|btf-adapters)/' "$ROOT/core")
  if [ -n "$out" ]; then echo "check:law FAIL [core-imports-nothing-above]:"; echo "$out"; fail=1; fi
fi
[ "$fail" -eq 0 ] && echo "check:law OK ($ROOT)"
exit "$fail"
