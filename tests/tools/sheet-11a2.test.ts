import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSheet } from "../../tools/maker/build-sheet.ts";
const BODY = "Saved to Downloads as my.zip. This is a web build: put it on any website host that takes HTML games, and anyone can play it in a browser. A phone app version comes in a later update.";
test("11a2 ready sheet: names the file, says it is a web build in UX's words, shows Share only when the zip can be shared, and Done; never says unzip or index.html; no build, no sheet", () => {
  const on = buildSheet({ mode: "ready", file: "my.zip", share: true });
  const off = buildSheet({ mode: "ready", file: "my.zip", share: false });
  assert.equal(buildSheet(null), "");
  assert.equal(on.includes("Your game is ready") && on.includes(BODY) && on.includes('data-act="build:share"') && on.includes("Share") && on.includes('data-act="build:done"') && on.includes("Done") && !on.includes("unzip") && !on.includes("index.html"), true);
  assert.equal(off.includes(BODY) && !off.includes('data-act="build:share"') && !off.includes("Share") && off.includes('data-act="build:done"') && !off.includes("unzip") && !off.includes("index.html"), true);
});
test("11a2 error sheet: Couldn't build your game with the plain reason, escaped, and Try again", () => {
  const html = buildSheet({ mode: "error", reason: "Can't build: <build.json>" });
  assert.equal(html.includes("Couldn't build your game") && html.includes("Can&#39;t build: &lt;build.json&gt;") && html.includes('data-act="build">Try again') && html.includes('data-act="build:done"') && !html.includes("unzip") && !html.includes("index.html") && !html.includes("Can't build: <build.json>"), true);
});
