/* r72: lazy-load Studio, the converter, social and the behaviour catalogue
   only when those screens are opened. Offline-first. No new deps. */
(function (global) {
  "use strict";
  const packs = {
    studio: ["js/sprite-slice.js", "js/body-map.js", "js/sprite-studio.js"],
    convert: ["js/convert-engine.js", "js/imagine-convert.js"],
    social: ["js/social-store.js", "js/social-hub.js"],
  };
  const loaded = {};
  const inflight = {};

  function loadScript(src) {
    if (loaded[src]) return Promise.resolve();
    if (inflight[src]) return inflight[src];
    inflight[src] = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = () => { loaded[src] = true; resolve(); };
      s.onerror = () => reject(new Error("Couldn't load " + src));
      document.head.appendChild(s);
    });
    return inflight[src];
  }

  function loadPack(name) {
    const files = packs[name];
    if (!files) return Promise.resolve();
    return files.reduce((p, src) => p.then(() => loadScript(src)), Promise.resolve());
  }

  let catPromise = null;
  function loadCatalogue() {
    if (global.__catalogueReady) return Promise.resolve(global.__catalogueReady);
    if (catPromise) return catPromise;
    catPromise = fetch("data/behaviours.json").then((r) => {
      if (!r.ok) throw new Error("catalogue");
      return r.json();
    }).then((data) => {
      global.__catalogueReady = data;
      if (global.__applyCatalogue) global.__applyCatalogue(data);
      return data;
    }).catch(() => {
      const empty = { behaviours: [], schema_version: 3, catalogue_rev: null };
      global.__catalogueReady = empty;
      if (global.__applyCatalogue) global.__applyCatalogue(empty);
      return empty;
    });
    return catPromise;
  }

  const SOCIAL = ["hub-shop", "hub-library", "creators", "creator", "inbox", "requests", "request-post", "request-detail"];
  const CATALOGUE = [
    "wizard-platform", "wizard-combat", "wizard-ability-pick", "wizard-camera", "wizard-tiles", "wizard-map",
    "pick-behaviour", "assign-behaviour", "behaviour-summary", "behaviour-question",
    "unit-editor", "unit-list", "loadout", "preview", "play", "stage-loadout", "stage-enemy-pool",
    "get-started", "my-setup", "starter-make", "starter-pack",
  ];

  function needs(id) {
    const out = [];
    if (id === "sprite-studio") out.push("studio", "convert");
    if (SOCIAL.indexOf(id) >= 0) out.push("social");
    if (CATALOGUE.indexOf(id) >= 0 || (id && id.indexOf("wizard-") === 0)) out.push("catalogue");
    if (id === "stage" || id === "place-unit") out.push("catalogue");
    return out;
  }

  function ensure(list) {
    const jobs = [];
    (list || []).forEach((n) => {
      if (n === "catalogue") jobs.push(loadCatalogue());
      else if (n === "studio") jobs.push(loadPack("studio"));
      else if (n === "convert") jobs.push(loadPack("studio").then(() => loadPack("convert")));
      else if (n === "social") jobs.push(loadPack("social"));
    });
    return Promise.all(jobs);
  }

  function ready(list) {
    return (list || []).every((n) => {
      if (n === "catalogue") return !!global.__catalogueReady;
      if (n === "studio") return !!global.SpriteStudio;
      if (n === "convert") return !!global.ImagineConvert;
      if (n === "social") return !!global.TileEngineSocial;
      return true;
    });
  }

  global.TileEngineLoad = { ensure, needs, ready, loadCatalogue, loadPack };
})(typeof window !== "undefined" ? window : globalThis);
