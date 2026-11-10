#!/bin/sh
# QA gate G3 (docs/qa/handback-checklist.md §1): no direct phase writes. Pattern copied verbatim; do not edit.
# Usage: sh scripts/check-state.sh [root]   (root defaults to src; tests pass a fixture dir)
ROOT="${1:-src}"
command -v rg >/dev/null 2>&1 || { echo "check:state: ripgrep (rg) is required" >&2; exit 2; }
fail=0
hits=$(rg -n --pcre2 -g '*.ts' -g '*.tsx' \
  -e '(?<![=!<>])\bphase\s*(=(?!=)|\+=|-=|\|\|=|&&=|\?\?=)' \
  -e '\.phase\s*(=(?!=)|\+=|-=|\|\|=|&&=|\?\?=)' \
  -e '\[\s*["\x27`]phase["\x27`]\s*\]\s*=(?!=)' \
  -e 'Object\.assign\([^)]*\bphase\b' \
  -e '\bphase\s*(\+\+|--)' \
  -e 'Reflect\.set\([^)]*["\x27`]phase' \
  "$ROOT")
case $? in 0) echo "check:state FAIL: direct phase writes:"; echo "$hits"; fail=1;; 1) ;; *) echo "check:state: rg error" >&2; exit 2;; esac
casts=$(rg -n -g '*.ts' -g '*.tsx' -e '\bas\s+Phase\b' "$ROOT")
[ -n "$casts" ] && { echo "check:state FAIL: Phase built by cast:"; echo "$casts"; fail=1; }
extra=$(rg -n -g '*.ts' -g '*.tsx' -e 'function\s+\w*[Gg]o\b' "$ROOT" | rg -v '^[^:]*state/xgo\.ts:[0-9]+:export function xGo\(')
[ -n "$extra" ] && { echo "check:state FAIL: second transition function:"; echo "$extra"; fail=1; }
review=$(rg -n -g '*.ts' -g '*.tsx' -e '=>\s*Phase\b' "$ROOT")
[ -n "$review" ] && { echo "check:state REVIEW (not a failure; QA reads these):"; echo "$review"; }
[ "$fail" -eq 0 ] && echo "check:state OK ($ROOT)"
exit "$fail"
