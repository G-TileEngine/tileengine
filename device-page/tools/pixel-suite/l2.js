// Step 34b L2: draws the fixture with the real canvas2d in this browser and hashes getImageData (sRGB) the same way L1 hashes the recording canvas.
                                                                       
import { frames, RASTERS, VIEW } from "./fixture.js";
export async function l2()                                                    {
  const images                              = {};
  for (const [id, r] of Object.entries(RASTERS)) { const d = new ImageData(r.w, r.h); r.px.forEach((p, i) => { d.data.set([(p >>> 16) & 255, (p >>> 8) & 255, p & 255, 255], i * 4); }); images[id] = await createImageBitmap(d); }
  const view = document.createElement("canvas"); view.width = VIEW.w; view.height = VIEW.h;
  const ctx = ()                           => view.getContext("2d")                            , make = (w        , h        )             => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c                         ; };
  const read = ()              => { const d = ctx().getImageData(0, 0, view.width, view.height).data, px = new Uint32Array(d.length / 4); for (let i = 0; i < px.length; i += 1) px[i] = (((d[i * 4 + 3] ?? 0) << 24) | ((d[i * 4] ?? 0) << 16) | ((d[i * 4 + 1] ?? 0) << 8) | (d[i * 4 + 2] ?? 0)) >>> 0; return px; };
  const hashes = frames(view                         , make, (id) => images[id], read); // the renderer makes the context first, so its colour space is the one read here (QA PX17)
  return { hashes, colorSpace: ctx().getContextAttributes().colorSpace ?? "srgb" };
}
Object.assign(window, { l2 });
