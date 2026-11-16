import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
test("E3 QA fence (ruling 13): no file in the scene folder uses a dynamic import, and match-link re-exports no value, so its only links are its type imports", () => {
  const dir = fileURLToPath(new URL("../../../src/runtime/scene/", import.meta.url));
  const code = (text: string): string => text.replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/.*$/gm, "$1");
  const bare = (text: string): string => code(text).replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)/g, "\"\"");
  const dynamic = (src: string): boolean => /\bimport\s*\(/.test(bare(src)), reexport = (src: string): boolean => /^\s*export\s+(?!type\b)[^;]*?\bfrom\s*[`'"]/m.test(code(src));
  const scene = readFileSync(`${dir}/world-scene.ts`, "utf8"), link = readFileSync(`${dir}/match-link.ts`, "utf8");
  assert.deepEqual([dynamic(scene), dynamic(link), reexport(link)], [false, false, false]);
  for (const extra of ['export const lazy = () => import("../render/index.ts");', 'const sim = await import("../../sim/index.ts");']) assert.equal(dynamic(`${link}\n${extra}`) && dynamic(`${scene}\n${extra}`), true, extra);
  for (const extra of ['export { createSceneLink } from "./world-scene.ts";', 'export * from "./world-scene.ts";', "export {\n  createSceneLink,\n} from './world-scene.ts';"]) assert.equal(reexport(`${link}\n${extra}`), true, extra);
  for (const fine of ['export type { SceneWorld } from "./world-scene.ts";', "// import('../render/index.ts')", 'const s = "export { a } from \'x\'";', 'const m = "import(";']) assert.equal(dynamic(`${link}\n${fine}`) || reexport(`${link}\n${fine}`), false, fine);
});
