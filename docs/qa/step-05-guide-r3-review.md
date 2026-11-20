# QA review: step-05 guide r3 + six ability look shots

QA & Build Guard, 2026-11-20 13:40 GMT. Guide r3: sha256 6b18bd39, hash-object 3077f863, 267 lines, base r2 015ef02b. Main 37f42de3.

**Verdict: NOT OK. One must-fix, on L249 only.**

## Checked, matches
- The diff against r2 is L249 only (1 line in, 1 line out). The share copy and the docs copy are identical.
- All six PNGs match their stated sha256, at 780x1688 (390x844 @2x).
- Sources: s1 = r72 69q-after-picker-home-light. s3 = 69q-after-abilities-suggested-light. s5 = ui-shell 69-abilities-suggested-light (the /workspace/tileengine copy; the r72-backup copy differs). s6 = 68-add-behaviour-picker. s4 = main's docs/maker/shots/68-unit-tap-edit-basic-light.png, byte for byte.
- The backing lines L155, L156, L159, L201 and L207 say what L249 claims for them.
- The left-out list matches what the shots show. s1 has the Suggested chips, Start from a role and Browse all (Advanced). No shot has an Other abilities card.

## Must-fix
1. L249 calls the files "The CEO's six prototype shots for #2 (shell-lessons L53)". shell-lessons L53 says those were taken on the CEO's phone on 2026-11-18, passed on by CoS, and "not stored in the repo". These files are the team's r72 ui-shell mock renders. s2 is a new UX render made today (make_status_mock.py), because r72 had no Status mock. Labelling team renders as CEO material breaks the attribution law. Suggested L249 text: "Stand-ins for the CEO's six prototype shots for #2 (shell-lessons L53; the phone shots are not in the repo), taken from the r72 ui-shell mocks; s2 is a new UX render (no r72 Status mock)". If CoS can confirm these are the same images the CEO sent, keep the current wording and cite where CoS confirmed it.

## Notes (no action needed)
- s4 duplicates main's 68-unit-tap-edit-basic-light.png. Git stores one blob for both, so it costs nothing.
- The s2 diagrams are look only. Slow Tiles is hand-drawn as a ring, and Stun and Poison show unit and target, not a reach. The tile diagram's content is set by L207 (engine reach via inOrthogonalReach), not by the shot.
- The helper .html, .py and .diff files stay out of the repo, as stated.
