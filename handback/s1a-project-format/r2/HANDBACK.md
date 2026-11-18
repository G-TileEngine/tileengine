# Hand-back s1a-project-format r2
Step file: docs/maker/steps/step-01-project-format.md §1a. QA must-fix: docs/qa/step-s1a-handback-review.md on main cbcf05b7. Nothing else changed.
Base: f137ca266400f68eaf93f1d49eb5c5986831ee96  Head: 619ec5fd87bc1017fa291d7f20703fb0d3d48b3a  Tree: 1425f8b9a54b1656ed52934a0733ed00c1091f4a  Branch: step/step-s1a-project-format-r2-chatA  PR: opened by Chief Of Staff from the branch
Node: v22.23.3  npm: 10.9.9  rg: ripgrep 14.1.1 (rev 4649aa9700)

## Green
npm test: 1034/0/0/0  typecheck: 0  lint: 0  deps: 0  check:state: 0  check:law: 0  npm run green: 0. Floor 1034. fail 0. No play-stage file is in the diff.

## Plants
P2 now keys each of the 12 base play-stage hits by file plus the exact line text, not the line number, so an edit of an allowlisted line is a new hit. (1) Replacing tools/play-stage/build.ts line 13 with `export const ours = (text: string): boolean => { void JSON.parse(text); return true; };` made P2 exit 1; the extra key was that full line. Restored. (2) Appending `void JSON.parse("{}");` to build.ts made P2 exit 1 (key `build.ts` plus that line). Restored. Appending the same line to src/project/load/read-project.ts made P2 exit 1 (key `read-project.ts` plus that line). Restored. Clean P2 then exited 0. migrate.ts stays exempt.

## Helpers & self-review
Self-review against the QA must-fix only: the allowlist no longer uses line numbers; a different JSON.parse on build.ts line 13 fails; a new JSON.parse on build.ts and on read-project.ts still fails. No other file. No rebase. Start remains r1 tip 5cf1a0fef4a4fa9d955633498ded887600e9abc3.
