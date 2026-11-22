                                      

export function backingSize(cssW        , cssH        , dpr        , exact                                             )                           {
  return exact ?? { w: Math.round(cssW * dpr), h: Math.round(cssH * dpr) };
}

export function fitView(devW        , devH        , s        , tileW        , tileH        )      {
  const scale = Math.max(1, Math.trunc(s));
  const artW = Math.floor(devW / scale);
  const artH = Math.floor(devH / scale);
  return {
    s: scale, devW, devH, artW, artH, padX: Math.floor((devW - artW * scale) / 2),
    padY: Math.floor((devH - artH * scale) / 2),
    tilesW: Math.floor(artW / tileW),
    tilesH: Math.floor(artH / tileH),
  };
}

export function scaleRange(devW        , devH        , mapW        , mapH        , zoomMax = 6)                                 {
  const sMin = Math.min(zoomMax, Math.max(1, Math.ceil(Math.min(devW / mapW, devH / mapH))));
  return { sMin, sMax: zoomMax };
}

export function snapScale(z        , range                                                  )         {
  return Math.min(range.sMax, Math.max(range.sMin, Math.round(z)));
}
