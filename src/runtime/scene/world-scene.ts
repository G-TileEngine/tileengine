import type { Notice } from "../../core/notice.ts";
import { badMs, clipEvents, clipPoints, createFxLive, createSeeThrough, poseMs, type Box, type Clip, type LiveEvent, type LiveFx, type Overlay, type RenderScene, type Sheet, type Standing, type TileLayer } from "../render/index.ts";

export type SceneAsset = { readonly sheet: Sheet; readonly clips?: readonly Clip[]; readonly tileProps?: Readonly<Record<string, { readonly anim?: string }>>; readonly noMirror?: boolean; readonly box?: Box };
export type SceneLayer = { readonly tileset: string | null; readonly aboveUnits: boolean; readonly visible: boolean; readonly tiles: readonly (number | null)[] };
export type SceneUnit = { readonly id: string; readonly sprite: string; readonly at: { readonly c: number; readonly r: number }; readonly offset: { readonly dx: number; readonly dy: number } | null; readonly facing: "N" | "E" | "S" | "W" | null; readonly alive: boolean; readonly action?: string };
export type SceneObject = { readonly assetId: string; readonly at: { readonly c: number; readonly r: number }; readonly z?: number };
export type SceneWorld = {
  readonly cols: number; readonly rows: number; readonly tileW: number; readonly tileH: number; readonly mapSeed: number;
  readonly assets: Readonly<Record<string, SceneAsset>>; readonly layers: readonly SceneLayer[];
  readonly units: readonly SceneUnit[]; readonly objects: readonly SceneObject[]; readonly overlays: readonly Overlay[]; readonly effects?: readonly LiveFx[]; readonly seeThroughCanopy?: boolean;
};
export type SceneClock = { readonly tMs: number; readonly stepMs: number; readonly lite?: boolean }; export type SceneLink = { scene(world: SceneWorld, at?: SceneClock): RenderScene; readonly notices: readonly Notice[]; readonly fired: readonly LiveEvent[]; readonly views: Readonly<Record<string, number>> };
const NO_OBJECTS: readonly SceneObject[] = [], NO_OVERLAYS: readonly Overlay[] = [];

export function pickClip(asset: SceneAsset, action: string, facing: SceneUnit["facing"]): { readonly clip?: Clip; readonly frame?: number; readonly flipX: boolean } {
  const dir = facing === "N" ? "up" : facing === "E" ? "right" : facing === "W" ? "left" : "down";
  const mirror = dir === "left" ? "right" : dir === "right" ? "left" : "";
  const find = (name: string): Clip | undefined => asset.clips?.find((c) => c.name === name);
  const chain = action === "die" ? ["die", "hit", "idle"] : action === "idle" ? ["idle"] : [action, "idle"];
  for (const name of chain) {
    const exact = find(`${name}-${dir}`) ?? (name === "move" ? find(dir) : undefined);
    if (exact !== undefined) return { clip: exact, flipX: false };
    if (mirror !== "" && asset.noMirror !== true) { const flip = find(`${name}-${mirror}`); if (flip !== undefined) return { clip: flip, flipX: true }; }
    for (const alt of [`${name}-down`, name, `${name}-left`, `${name}-right`, `${name}-up`]) { const hit = find(alt); if (hit !== undefined) return { clip: hit, flipX: false }; }
  }
  return { frame: asset.clips?.[0]?.frames[0] ?? 0, flipX: false };
}
const shown = (world: SceneWorld): SceneUnit[] => world.units.filter((u) => (u.alive || u.action === "die") && world.assets[u.sprite] !== undefined);
const unitKey = (world: SceneWorld): string => JSON.stringify([world.cols, world.rows, world.tileW, world.tileH, world.mapSeed, shown(world).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).map((u) => JSON.stringify([u.id, u.sprite, u.at.c, u.at.r, u.offset?.dx ?? null, u.offset?.dy ?? null, u.facing, u.action ?? null]))]);

function layersOf(world: SceneWorld): { ground: TileLayer[]; above: TileLayer[] } {
  const ground: TileLayer[] = [], above: TileLayer[] = [];
  for (const layer of world.layers) {
    if (!layer.visible || layer.tileset === null) continue;
    const asset = world.assets[layer.tileset];
    if (asset === undefined) continue;
    const anims: Record<number, Clip> = {};
    for (const [id, prop] of Object.entries(asset.tileProps ?? {})) { const clip = prop.anim === undefined ? undefined : asset.clips?.find((c) => c.name === prop.anim); if (clip !== undefined) anims[Number(id)] = clip; }
    const row: TileLayer = { sheet: asset.sheet, tiles: layer.tiles, ...(Object.keys(anims).length > 0 ? { anims } : {}) };
    (layer.aboveUnits ? above : ground).push(row);
  }
  return { ground, above };
}

function standings(world: SceneWorld): Standing[] {
  const out: Standing[] = [];
  for (const o of world.objects) { const asset = world.assets[o.assetId]; if (asset === undefined) continue; out.push({ kind: "object", sheet: asset.sheet, c: o.at.c, r: o.at.r, ...(o.z === undefined ? {} : { z: o.z }) }); }
  for (const u of shown(world).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))) {
    const asset = world.assets[u.sprite];
    if (asset === undefined) continue;
    const pick = pickClip(asset, u.action ?? "idle", u.facing);
    out.push({ kind: "unit", sheet: asset.sheet, c: u.at.c, r: u.at.r, key: u.id, ...(u.offset === null ? {} : { dx: u.offset.dx * world.tileW, dy: u.offset.dy * world.tileH }), ...(pick.clip === undefined ? {} : { clip: pick.clip }), ...(pick.frame === undefined ? {} : { frame: pick.frame }), ...(pick.flipX ? { flipX: true } : {}) });
  }
  return out;
}

export function createSceneLink(): SceneLink {
  const notices: Notice[] = [], seen = new WeakSet<SceneAsset>(), bad = new WeakSet<Clip>();
  const live = createFxLive(), see = createSeeThrough();
  let fired: LiveEvent[] = [], views: Record<string, number> = {}, last = Number.NEGATIVE_INFINITY;
  let prev: { assets: SceneWorld["assets"]; layers: SceneWorld["layers"]; objects: readonly SceneObject[]; overlays: readonly Overlay[]; key: string; scene: RenderScene } | undefined;
  const note = (asset: SceneAsset): void => {
    if (seen.has(asset)) return;
    seen.add(asset);
    let fpsBad = false, lenBad = false, both = false, evBad = false, ptBad = false, capBad = false;
    for (const clip of asset.clips ?? []) {
      const invalid = badMs(clip.ms);
      if (invalid && !bad.has(clip)) { bad.add(clip); notices.push({ code: "clipMsInvalid", message: clip.name }); }
      if (!invalid && Array.isArray(clip.ms) && clip.ms.length > 0) { if (clip.ms.length !== clip.frames.length) lenBad = true; if (clip.fps !== undefined) both = true; }
      if (clip.fps !== undefined && !(typeof clip.fps === "number" && Number.isFinite(clip.fps) && clip.fps > 0)) fpsBad = true;
      if (clip.frames.length >= 1 && clip.events != null) for (const row of clipEvents(clip.events, clip.frames.length).notes) { if (row.code === "clipEventInvalid") evBad = true; else if (row.code === "clipEventsOverCap") capBad = true; }
      if (clip.frames.length >= 1 && clip.points != null && clipPoints(clip.points, clip.frames.length, asset.sheet.fw, asset.sheet.fh).notes.length > 0) ptBad = true;
    }
    if (fpsBad) notices.push({ code: "clipFpsInvalid", message: asset.sheet.id });
    if (lenBad) notices.push({ code: "clipMsLength", message: asset.sheet.id });
    if (both) notices.push({ code: "clipFpsIgnored", message: asset.sheet.id });
    if (evBad) notices.push({ code: "clipEventInvalid", message: asset.sheet.id }); if (ptBad) notices.push({ code: "clipPointsInvalid", message: asset.sheet.id }); if (capBad) notices.push({ code: "clipEventsOverCap", message: asset.sheet.id });
  };
  const link: SceneLink = {
    notices, get fired() { return fired; }, get views() { return views; },
    scene(world, clock) {
      const finite = clock !== undefined && Number.isFinite(clock.tMs), base = standings(world);
      let fxStanding: Standing[] = [], fxOverlays: Overlay[] = [];
      if (finite && clock !== undefined) {
        const grid = { tileW: world.tileW, tileH: world.tileH, stepMs: clock.stepMs, mapSeed: world.mapSeed, ...(clock.lite === undefined ? {} : { lite: clock.lite }) };
        const out = live.frame(world.effects ?? [], (id) => { const st = base.find((s) => s.kind === "unit" && s.key === id); if (st === undefined) return null; const src = world.units.find((u) => u.id === id); return live.unit(st, src?.facing ?? null, src === undefined ? undefined : world.assets[src.sprite]?.box, clock.tMs, grid); }, last, clock.tMs, grid);
        fired = out.fired; views = out.views; fxStanding = out.standing; fxOverlays = out.overlays;
        for (const row of out.notes) notices.push(row); last = clock.tMs;
      } else { fired = []; views = {}; }
      const fxKey = finite && clock !== undefined && (world.effects?.length ?? 0) > 0 ? `${poseMs(clock.tMs, clock.lite === true)}:${clock.stepMs}:${clock.lite === true}:${JSON.stringify(world.effects)}` : "";
      const key = unitKey(world) + fxKey, objects = world.objects.length === 0 ? NO_OBJECTS : world.objects, overlays = world.overlays.length === 0 ? NO_OVERLAYS : world.overlays, cached = prev;
      if (cached !== undefined && cached.assets === world.assets && cached.layers === world.layers && cached.objects === objects && cached.overlays === overlays && cached.key === key) return see(cached.scene, world.seeThroughCanopy);
      const reuse = cached !== undefined && cached.assets === world.assets && cached.layers === world.layers;
      if (!reuse) for (const asset of Object.values(world.assets)) note(asset);
      const built = reuse && cached !== undefined ? { ground: cached.scene.ground, above: cached.scene.above } : layersOf(world);
      const scene: RenderScene = { cols: world.cols, rows: world.rows, tileW: world.tileW, tileH: world.tileH, mapSeed: world.mapSeed, ground: built.ground, above: built.above, standing: fxStanding.length > 0 ? [...base, ...fxStanding] : base, overlays: fxOverlays.length > 0 ? [...world.overlays, ...fxOverlays] : world.overlays };
      prev = { assets: world.assets, layers: world.layers, objects, overlays, key, scene };
      return see(scene, world.seeThroughCanopy);
    },
  };
  return link;
}
