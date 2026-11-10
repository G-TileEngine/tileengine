// TileEngine engine lint (BUILD_GUIDE §2). Fast feedback; scripts/check-law.sh and dependency-cruiser are the hard gates.
import tseslint from "typescript-eslint";

// One clock (BUILD_GUIDE §2 law 1). The single exception: src/runtime/host/raf-driver.ts may use the two frame globals.
const RAF_DRIVER = "src/runtime/host/raf-driver.ts";
const frameGlobals = ["requestAnimationFrame", "cancelAnimationFrame"]
  .map((name) => ({ name, message: `One clock: only ${RAF_DRIVER} owns the frame loop.` }));
const timeGlobals = ["setInterval", "setTimeout", "queueMicrotask"]
  .map((name) => ({ name, message: "One clock: use core/clock (BUILD_GUIDE §2 law 1)." }));
const netGlobals = ["fetch", "WebSocket", "XMLHttpRequest", "EventSource", "RTCPeerConnection"]
  .map((name) => ({ name, message: "Offline-first: network only in src/net or src/platform." }));
const storeGlobals = ["localStorage", "sessionStorage", "indexedDB"]
  .map((name) => ({ name, message: "Storage only in src/platform." }));

export default tseslint.config(
  { ignores: ["node_modules/**", "tests/fixtures/**", "dist/**", "handback/**"] },
  ...tseslint.configs.strict,
  {
    files: ["src/**/*.ts"],
    linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: "error" },
    rules: {
      "no-restricted-globals": ["error", ...frameGlobals, ...timeGlobals, ...netGlobals, ...storeGlobals],
      "no-restricted-properties": ["error",
        { object: "Math", property: "random", message: "Use the seeded core/rng." },
        { object: "Date", property: "now", message: "One clock: sim time only." },
        { object: "performance", property: "now", message: "One clock: sim time only." },
        { object: "crypto", property: "getRandomValues", message: "Use the seeded core/rng." }],
      "no-restricted-syntax": ["error",
        { selector: "NewExpression[callee.name='Date']", message: "One clock: no wall time." },
        { selector: "TSEnumDeclaration", message: "No enums (erasableSyntaxOnly; use string unions)." }],
    },
  },
  {
    files: [RAF_DRIVER],
    rules: { "no-restricted-globals": ["error", ...timeGlobals, ...netGlobals, ...storeGlobals] },
  },
  {
    files: ["src/core/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { group: ["**/state/**", "**/rules/**", "**/project/**", "**/runtime/**", "**/btf-adapters/**", "**/sim/**"],
          message: "core imports nothing above it (ARCHITECTURE §2 rule 1; MODES-v1 M2)." }] }],
      "id-denylist": ["error", "hp", "maxHp", "mana", "cost", "deck", "damage", "card", "cards", "phase"],
    },
  },
  {
    files: ["src/state/**/*.ts", "src/types/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { group: ["**/core/**", "**/rules/**", "**/project/**", "**/runtime/**", "**/btf-adapters/**", "**/sim/**"],
          message: "state and types import only src/types (BUILD_GUIDE §3)." }] }],
    },
  },
);
