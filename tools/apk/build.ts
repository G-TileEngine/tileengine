import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { build, refuse, ROOT } from "../play-stage/build.ts";

export const APP_ID = "com.tileengine.play", APP_NAME = "TileEngine", MIN_SDK = 26;
export const CAP = { core: "6.2.0", app: "6.0.3", android: "6.2.0", cli: "6.2.0" } as const;
export const DEBUG_GLOBALS = ["__play", "__driver", "__cam", "__hud", "__fx", "__link", "DEV", "// dev-only"] as const;
const FORBIDDEN = ["editor", "effect-designer", "painter-proto", "ui-shell"];
const NET = /(?:https?|wss?):\/\/[^\s"'`<>\\]+/gi;
const MAIN = `package ${APP_ID};

import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle saved) {
    super.onCreate(saved);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    hideSystemBars();
  }

  private void hideSystemBars() {
    getWindow().getDecorView().setSystemUiVisibility(
      android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        | android.view.View.SYSTEM_UI_FLAG_FULLSCREEN
        | android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);
  }
}
`;

export function listFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (at: string): void => {
    for (const e of readdirSync(at, { withFileTypes: true })) {
      const p = join(at, e.name);
      if (e.isDirectory()) walk(p); else out.push(relative(dir, p).replaceAll("\\", "/"));
    }
  };
  if (existsSync(dir)) walk(dir);
  return out.sort();
}
export const networkUrls = (dir: string): string[] => listFiles(dir).flatMap((name) => [...readFileSync(join(dir, name), "utf8").matchAll(NET)].map((m) => `${name}: ${m[0]}`));
export const playOnly = (dir: string): string[] => listFiles(dir).filter((name) => FORBIDDEN.some((bad) => name.includes(bad)));
export function treeSha(dir: string): string {
  const hash = createHash("sha256");
  for (const name of listFiles(dir)) { hash.update(name); hash.update("\0"); hash.update(readFileSync(join(dir, name))); hash.update("\0"); }
  return hash.digest("hex");
}
export function writeMeta(file: string, commit: string, wwwSha256: string): void {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify({ commit, wwwSha256, playOnly: true, appId: APP_ID, minSdk: MIN_SDK, androidScheme: "https" }, null, 2)}\n`);
}
export const debugGlobals = (dir: string): string[] => listFiles(dir).filter((name) => { const text = readFileSync(join(dir, name), "utf8"); return DEBUG_GLOBALS.some((g) => text.includes(g)); });
export function buildWeb(out: string, commit: string, root: string = ROOT, dev = false): string { return build(out, commit, root, dev); }
export function patchMainActivity(android: string): string {
  const dest = join(android, "app/src/main/java", ...APP_ID.split("."), "MainActivity.java");
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, MAIN);
  return dest;
}
export function patchGradle(android: string): void {
  const gradle = join(android, "app/build.gradle");
  writeFileSync(gradle, readFileSync(gradle, "utf8").replace(/\bminSdk(?:Version)?\s+\d+/g, (hit) => hit.replace(/\d+$/, String(MIN_SDK))));
  const man = join(android, "app/src/main/AndroidManifest.xml");
  const xml = readFileSync(man, "utf8");
  writeFileSync(man, xml.includes('android:screenOrientation="portrait"') ? xml : xml.replace("<activity ", '<activity android:screenOrientation="portrait" '));
}
export function buildApk(www: string, android: string): void {
  const bad = debugGlobals(www);
  if (bad.length > 0) throw new Error(`apk: www has debug paths: ${bad.join(", ")}`);
  patchMainActivity(android); patchGradle(android);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const flag = process.argv[2], dest = process.argv[3];
  const head = String(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", cwd: ROOT })).trim();
  const dirty = String(execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { encoding: "utf8", cwd: ROOT }));
  if (flag === "--web") {
    if (dest === undefined) { console.error("usage: node tools/apk/build.ts --web <out>"); process.exit(1); }
    const why = refuse(head, undefined, dirty);
    if (why !== null) { console.error(why); process.exit(1); }
    buildWeb(dest, head);
    writeMeta(join(dirname(dest), "apk-build.json"), head, treeSha(dest));
  } else if (flag === "--apk") {
    const android = join(ROOT, "tools/apk/android"), cap = join(ROOT, "tools/apk/node_modules/@capacitor/cli");
    if (!existsSync(cap) || !existsSync(android)) { console.error("apk: Capacitor or android/ is missing. CoS/EA run npm i and cap add android in tools/apk on the box."); process.exit(2); }
    try { buildApk(dest ?? join(ROOT, "tools/apk/www"), android); }
    catch (err) { console.error(err instanceof Error ? err.message : String(err)); process.exit(1); }
  } else { console.error("usage: node tools/apk/build.ts --web <out> | --apk"); process.exit(1); }
}
