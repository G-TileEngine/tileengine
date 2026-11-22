                                           

/** Half up, and `+ 0` kills a negative zero. */
export const px = (v        )         => Math.floor(v + 0.5) + 0;

export function clampCamera(x        , y        , fit     , mapW        , mapH        )                           {
  const axis = (v        , map        , art        )         => (map <= art ? (map - art) / 2 : Math.min(map - art, Math.max(0, v)));
  return { x: axis(x, mapW, fit.artW), y: axis(y, mapH, fit.artH) };
}

export function snapCamera(x        , y        , s        )      {
  return {
    x, y,
    devX: px(x * s), devY: px(y * s),
  };
}

export function easeCamera(from        , to        , elapsedMs        , easeMs        )         {
  if (easeMs <= 0 || elapsedMs >= easeMs) return to;
  const t = Math.min(1, Math.max(0, elapsedMs / easeMs));
  const u = t * t * (3 - 2 * t);
  return from + (to - from) * u;
}

export function toDevice(artX        , artY        , cam     , fit     )                           {
  return { x: px(artX) * fit.s - cam.devX + fit.padX, y: px(artY) * fit.s - cam.devY + fit.padY };
}
