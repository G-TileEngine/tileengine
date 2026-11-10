# CN-002: no-card-types also catches camelCase Card/Deck names
Date: 2026-11-10   Raised by: QA (kit review r5, note 1); ruled by Engine Architect
Old: `scripts/check-law.sh` — `gate no-card-types -g '!**/types/core-types.ts' -e '\b\w*(Card|Deck)s?\b'` (misses `CardId`, `DeckList`, `DeckState`).
New: `gate no-card-types -g '!**/types/core-types.ts' -e '\b\w*(Card|Deck)(s|[A-Z]\w*)?\b'`, plus the fixture `tests/fixtures/law-bad/rules/card-id.ts`:
```ts
export type CardId = string;
export interface DeckState { n: number }
```
`Cardinal` and `cardinalDir` (law-good) still pass; `src/` still passes (checked by the Architect against `main` a30041e on 2026-11-10).
Affected steps already done: step-00-skeleton (owns `scripts/check-law.sh` and the fixtures).
Action: refactor, do not patch. Carried by `steps/step-01-state-tables.md` (Files: `scripts/check-law.sh` one-line change, new `tests/fixtures/law-bad/rules/card-id.ts`; the existing law test in step 00 keeps asserting law-bad exits 1, law-good exits 0).
Kit files updated: steps/step-01-state-tables.md. step-00-skeleton.md is history (accepted) and is not edited.
