import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { APP_ID, APP_NAME, CAP, MIN_SDK, buildWeb, listFiles, networkUrls, patchGradle, patchMainActivity, playOnly, treeSha, writeMeta } from "../../tools/apk/build.ts";
import { ROOT } from "../../tools/play-stage/build.ts";

const tmp = (): string => mkdtempSync(join(tmpdir(), "p19-"));

test("tools/apk has its own Capacitor 6 pins and the root package is unchanged", () => {
  const pkg = JSON.parse(readFileSync(join(ROOT, "tools/apk/package.json"), "utf8")) as { dependencies: Record<string, string>; name: string };
  const cap = JSON.parse(readFileSync(join(ROOT, "tools/apk/capacitor.config.json"), "utf8")) as { appId: string; appName: string; webDir: string; android: { allowMixedContent: boolean }; server: { androidScheme: string } };
  const root = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as { dependencies?: Record<string, string>; devDependencies: Record<string, string> };
  assert.equal(pkg.name, "tileengine-apk");
  assert.equal(pkg.dependencies["@capacitor/core"], CAP.core);
  assert.equal(pkg.dependencies["@capacitor/app"], CAP.app);
  assert.equal(pkg.dependencies["@capacitor/android"], CAP.android);
  assert.equal(pkg.dependencies["@capacitor/cli"], CAP.cli);
  assert.ok(!Object.hasOwn(root.devDependencies, "@capacitor/core") && root.dependencies === undefined);
  assert.equal(cap.appId, APP_ID);
  assert.equal(cap.appName, APP_NAME);
  assert.equal(cap.webDir, "www");
  assert.equal(cap.android.allowMixedContent, false);
  assert.equal(cap.server.androidScheme, "https");
  assert.equal(MIN_SDK, 26);
});

test("the www folder is a play-only static build: no network URL, no editor files, apk-build.json matches the tree", () => {
  const out = tmp();
  try {
    buildWeb(out, "0".repeat(40));
    assert.equal(networkUrls(out).length, 0);
    assert.equal(playOnly(out).length, 0);
    assert.ok(listFiles(out).includes("index.html"));
    assert.ok(listFiles(out).some((n) => n.endsWith("tools/play-stage/page.js")));
    assert.ok(!listFiles(out).some((n) => n.includes("effect-designer")));
    const meta = join(out, "..", "apk-build.json");
    writeMeta(meta, "0".repeat(40), treeSha(out));
    const body = JSON.parse(readFileSync(meta, "utf8")) as { playOnly: boolean; wwwSha256: string; minSdk: number; androidScheme: string; appId: string };
    assert.equal(body.playOnly, true);
    assert.equal(body.wwwSha256, treeSha(out));
    assert.equal(body.minSdk, 26);
    assert.equal(body.androidScheme, "https");
    assert.equal(body.appId, APP_ID);
  } finally { rmSync(out, { recursive: true, force: true }); }
});

test("patchMainActivity is rewritten after a sync overwrite and patchGradle keeps minSdk 26 and portrait", () => {
  const android = tmp();
  try {
    mkdirSync(join(android, "app/src/main/java/com/tileengine/play"), { recursive: true });
    writeFileSync(join(android, "app/src/main/java/com/tileengine/play/MainActivity.java"), "package stale;\npublic class MainActivity {}\n");
    mkdirSync(join(android, "app/src/main"), { recursive: true });
    writeFileSync(join(android, "app/build.gradle"), "android { defaultConfig { minSdkVersion 22\n minSdk 22 } }\n");
    writeFileSync(join(android, "app/src/main/AndroidManifest.xml"), "<manifest><application><activity android:name=\".MainActivity\"></activity></application></manifest>\n");
    const dest = patchMainActivity(android);
    const java = readFileSync(dest, "utf8");
    assert.ok(java.includes(`package ${APP_ID}`));
    assert.ok(java.includes("FLAG_KEEP_SCREEN_ON"));
    assert.ok(java.includes("hideSystemBars"));
    assert.ok(!/(?:https?|wss?):\/\//i.test(java));
    patchGradle(android);
    assert.ok(readFileSync(join(android, "app/build.gradle"), "utf8").includes("minSdkVersion 26"));
    assert.ok(readFileSync(join(android, "app/src/main/AndroidManifest.xml"), "utf8").includes('android:screenOrientation="portrait"'));
    assert.equal(existsSync(dest), true);
  } finally { rmSync(android, { recursive: true, force: true }); }
});
test("networkUrls reports a planted http(s) URL and playOnly flags an editor file", () => {
  const out = tmp();
  try {
    writeFileSync(join(out, "index.html"), "<!doctype html><script>fetch('https://evil.example/x')</script>\n");
    writeFileSync(join(out, "effect-designer.js"), "export default 1;\n");
    const urls = networkUrls(out);
    assert.ok(urls.some((s) => s.includes("https://evil.example/x")), urls.join(" | "));
    const extra = playOnly(out);
    assert.ok(extra.some((s) => s.includes("effect-designer")), extra.join(" | "));
  } finally { rmSync(out, { recursive: true, force: true }); }
});
