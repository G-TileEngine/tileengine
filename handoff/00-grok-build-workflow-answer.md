# Grok Build's own workflow answer (pasted by CEO, 2026-11-09)

Summary of what Grok Build asked for:
- Access: files in its shared workspace (/workspace/artifacts and subfolders) are preferred, then a git repo (clone URL), then a zip. Pasting is a last resort. About 50-80 kB of focused text per message. Early decisions fade after 15-20 turns unless they're in the root guide.
- Memory: it remembers nothing between sessions, only what's in the repo. It needs a root BUILD_GUIDE.md (or AGENTS.md) with: the goal and priority order (grid tactics, then menu RPG, then RTS), folder layout and naming, the state-table rule and the exact xGo signature, a never-do list, how to run tests and what "green" means, and pointers to the design docs.
- Step size: about 150-400 lines of code, or one subsystem. The template sections are Goal / Files to create or change / Interfaces to match (quoted exactly) / Tests that prove it is done / Do not touch / Acceptance.
- State rule: tables live in src/state/<mode>.table.ts. The only transition is xGo(from: Phase, event: Event): Phase. Any `phase = ...` outside xGo is a bug, and a grep check runs on every hand-back.
- Hand-back after each step: changed files, test output, a 5-10 line "Decisions & deviations" note, and an optional next step.
- Change Notice template: Old / New / Affected steps already done / Action ("refactor, do not patch").
- Risks: drift, state violations, context loss, scope creep, large diffs, silent defaults. These are handled by quoted interfaces, the grep check, the root guide, the Do-not-touch list, the step size cap and the Decisions note.
- Cadence: 1-3 steps per session. Re-read the guide every 5-7 steps.
- Example Step 0: an empty TS project with package.json, tsconfig (strict, ES2022), src/, src/state/, tests/smoke.test.ts, BUILD_GUIDE.md and .gitignore. npm test and npm run typecheck must exit 0.
