/** Layer gate (ARCHITECTURE §2, single-package form; BUILD_GUIDE §3). Anything not allowed here is forbidden. */
module.exports = {
  forbidden: [
    { name: "no-circular", severity: "error", from: {}, to: { circular: true } },
    { name: "types-is-leaf", severity: "error", from: { path: "^src/types" }, to: { path: "^src/(?!types)" } },
    { name: "core-imports-only-types", severity: "error", from: { path: "^src/core" }, to: { path: "^src/(?!core|types)" } },
    { name: "state-imports-only-types", severity: "error", from: { path: "^src/state" }, to: { path: "^src/(?!state|types)" } },
    { name: "project-imports-only-types", severity: "error", from: { path: "^src/project" }, to: { path: "^src/(?!project|types|core/notice\\.ts$)" } },
    { name: "rules-below-runtime", severity: "error", from: { path: "^src/rules" }, to: { path: "^src/(runtime|sim|btf-adapters|project)" } },
    { name: "adapters-only-from-runtime-editor", severity: "error", from: { path: "^src/(?!runtime|editor|btf-adapters)" }, to: { path: "^src/btf-adapters" } },
    { name: "nothing-imports-sim", severity: "error", from: { path: "^src/(?!sim)" }, to: { path: "^src/sim" } },
    { name: "no-btf-folder", severity: "error", from: {}, to: { path: "(g-tile-engine|towerchess)" } },
    { name: "no-tests-in-src", severity: "error", from: { path: "^src" }, to: { path: "^tests" } },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
  },
};
