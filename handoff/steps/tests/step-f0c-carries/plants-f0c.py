#!/usr/bin/env python3
"""F0c plants (r2): each edit alone must make tests/project/f0c-carries.test.ts (or the smoke pin) fail. Run from the repo root on a clean F0c tree."""
import subprocess, sys
P = [
 ("P1 Test drops pool lines", "tools/maker/test-launch.ts", "stageNames(load), poolLines(load))", "stageNames(load))"),
 ("P2 Build game drops pool lines", "tools/maker/export.ts", "stageNames(load), poolLines(load))", "stageNames(load))"),
 ("P3 play keeps its own caps", "tools/play-stage/project.ts", "const core = readStage(stage, PLAY_LIMITS)", "const core = readStage(stage, { picks: 8, waveUnits: 16 })"),
 ("P4 no reader check", "src/editor/project/test-gate.ts", "if (readerOk && !playOk) {", "if (!playOk) {"),
 ("P5 pool lines before hard lines", "src/editor/project/test-gate.ts", ".map((row) => (row.code === \"budgetOver\" ? overLine(row, names) : sentence(row))).concat(more);", ".map((row) => (row.code === \"budgetOver\" ? overLine(row, names) : sentence(row))); lines.unshift(...more);"),
 ("P6 stage id instead of name", "src/editor/project/test-gate.ts", "lines.push(poolLine(names[id] ?? id));", "lines.push(poolLine(id));"),
 ("P7 gate PLAY_LIMITS drift", "src/project/load/read-project.ts", "export const PLAY_LIMITS = { picks: 0, waveUnits: 0 } as const;", "export const PLAY_LIMITS = { picks: 1, waveUnits: 0 } as const;"),
 ("P8 CN-029 not applied", "src/types/core-types.ts", "  readonly budgets?: ProjectBudgets;", "  readonly budgetz?: ProjectBudgets;"),
 ("P9 engine cap widened (load.ts)", "tools/play-stage/load.ts", "stageLimits: PLAY_LIMITS", "stageLimits: { picks: 8, waveUnits: 16 }"),
 ("P10 arriveIn and openProject caps widened", "tools/play-stage/project.ts", "readStage(stage, PLAY_LIMITS)", "readStage(stage, { picks: 8, waveUnits: 16 })", 2),
 ("P11 arriveIn skips the stage check", "tools/play-stage/project.ts", "if (read === null || !read.ok) return openProject(files, toId);", "if (read === null || !read.ok) return { docs: null, error: \"play: arrive\" };"),
 ("P12 pool lines dropped by testGate (QA)", "src/editor/project/test-gate.ts", ".concat(more);", ";"),
 ("P13 only the first refused stage (QA)", "src/editor/project/test-gate.ts", "      lines.push(poolLine(names[id] ?? id));\n", "      lines.push(poolLine(names[id] ?? id));\n      break;\n"),
]
caught = 0
for plant in P:
    name, path, old, new = plant[:4]
    want = plant[4] if len(plant) > 4 else 1
    src = open(path).read()
    assert src.count(old) == want, (name, src.count(old))
    open(path, "w").write(src.replace(old, new))
    try:
        r = subprocess.run(["node", "--test", "tests/project/f0c-carries.test.ts", "tests/smoke.test.ts"], capture_output=True, text=True)
    finally:
        open(path, "w").write(src)
    hit = r.returncode != 0
    caught += hit
    print(("CAUGHT " if hit else "MISSED ") + name)
print(f"{caught}/{len(P)} caught")
sys.exit(0 if caught == len(P) else 1)
