# QA check: step F1 look kit r3b (guide-only delta on r3)

Reviewer: QA & Build Guard. Date: 2026-11-27, about 17:00 London.

This check sits on top of `step-f1-kit-r3-recheck.md` (sha256 `d4be12de…`).

**Verdict: OK TO SEND r3b.**

## Hashes

`sha256sum -c SHA256SUMS` passes; the sums file is `7349f8fd…`.

| File | sha256 |
|---|---|
| Guide | `9d7ecff2…` (201 lines) |
| Paste | `3ac35cd7…` (L1 is the placeholder) |
| Push list | `9059b15b…` |

`cmp` against the `*.r3` copies shows the patch (`c0ea4042`), the test (`83ef2acf`) and the plants (`2f23d56c`) are byte-identical. So the r3 run stands: tree `4ccddd3f`, 377/380, 1188/0, plants 29/29, smokes 25/25, audit 136/150/150.

## Guide diff, r3 to r3b

- **L3:** the revision line, which now credits UX at 16:45 and EA's size call.
- **L72:** Ruling 10, the dropped New project sub line. That matches the trial.
- **L193 (a):** the On aria-label `{label}: On` goes to F2a. I checked the 7 named smoke lines on `e0455199`: s6a L54, L60 and L62, and s6c L57, L62, L63 and L69 each read `aria-label="On your team"`. At 2 counted lines each, that's 377 + 14 = 391, so deferring it is right.
- **L194 (b):** `+ Add ability` getting the plus icon goes to F2b.

## Paste and push list

- The paste diff is L4 only: the guide's sha, its 201 lines and r3b.
- The push list diff covers only the r3b wording, the guide hash and the paste hash.

## Carries for F2a

- The On aria-label, with a pin and a plant.
- The dead `.card.new` in `app.css` L8.
