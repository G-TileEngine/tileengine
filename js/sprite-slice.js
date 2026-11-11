/* Sprite / tileset auto-slice helpers — ported from mock-art/js/art.js (exact-repeat dedupe). */
(function (global) {
  "use strict";

  function canvasOf(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const x = c.getContext("2d");
    x.imageSmoothingEnabled = false;
    return c;
  }

  function draw(src, w, h, sx, sy, sw, sh) {
    sx = sx || 0;
    sy = sy || 0;
    sw = sw == null ? w : sw;
    sh = sh == null ? h : sh;
    const c = canvasOf(w, h);
    c.getContext("2d").drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
    return c;
  }

  function cellHash(ctx, x, y, w, h) {
    const d = ctx.getImageData(x, y, w, h).data;
    let a = 2166136261 >>> 0;
    for (let i = 0; i < d.length; i++) {
      a ^= d[i];
      a = Math.imul(a, 16777619) >>> 0;
    }
    return a.toString(36) + ":" + d.length;
  }

  function previewZoom(w, h, maxW, maxH) {
    maxH = maxH == null ? 9999 : maxH;
    const up = Math.min(Math.floor(maxW / w), Math.floor(maxH / h));
    if (up >= 1) return { z: Math.min(up, 8), label: Math.min(up, 8) + "×" };
    for (const d of [2, 3, 4, 6, 8, 16]) {
      if (w / d <= maxW && h / d <= maxH) return { z: 1 / d, label: "1/" + d + " size preview" };
    }
    return { z: 1 / 32, label: "1/32 size preview" };
  }

  function showCanvas(c, maxW, maxH) {
    const pz = previewZoom(c.width, c.height, maxW, maxH);
    c.classList.add("px");
    c.style.width = c.width * pz.z + "px";
    c.style.height = c.height * pz.z + "px";
    c.style.imageRendering = "pixelated";
    return pz;
  }

  function loadImageFromFile(file) {
    return new Promise(function (res, rej) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () {
        res({ img: img, name: file.name, bytes: file.size, type: file.type || "image/png", url: url });
      };
      img.onerror = rej;
      img.src = url;
    });
  }

  function loadImageFromUrl(url, name) {
    return new Promise(function (res, rej) {
      const img = new Image();
      img.onload = function () {
        res({ img: img, name: name || "image", bytes: 0, type: "image/png", url: url });
      };
      img.onerror = rej;
      img.src = url;
    });
  }

  /** Auto-slice into tileSize cells; merge exact pixel repeats only. Original canvas untouched. */
  function autoSlice(srcCanvas, tileSize) {
    const T = tileSize | 0;
    if (T < 1) throw new Error("bad tile");
    const w = srcCanvas.width;
    const h = srcCanvas.height;
    const cropW = Math.floor(w / T) * T;
    const cropH = Math.floor(h / T) * T;
    const cropped = cropW === w && cropH === h ? srcCanvas : draw(srcCanvas, cropW, cropH, 0, 0, cropW, cropH);
    const cols = cropW / T;
    const rows = cropH / T;
    const ctx = cropped.getContext("2d");
    const seen = new Map();
    const uniq = [];
    const terrain = [];
    for (let r = 0; r < rows; r++) {
      for (let q = 0; q < cols; q++) {
        const k = cellHash(ctx, q * T, r * T, T, T);
        if (!seen.has(k)) {
          seen.set(k, uniq.length);
          uniq.push([q, r]);
        }
        terrain.push(seen.get(k));
      }
    }
    const per = Math.min(8, Math.max(1, uniq.length));
    const ts = canvasOf(per * T, Math.ceil(uniq.length / per) * T);
    const tx = ts.getContext("2d");
    tx.imageSmoothingEnabled = false;
    uniq.forEach(function (pair, i) {
      const q = pair[0];
      const r = pair[1];
      const dx = (i % per) * T;
      const dy = Math.floor(i / per) * T;
      tx.clearRect(dx, dy, T, T);
      tx.drawImage(cropped, q * T, r * T, T, T, dx, dy, T, T);
    });
    const cells = cols * rows;
    return {
      cols: cols,
      rows: rows,
      tileSize: T,
      cells: cells,
      unique: uniq.length,
      repeatsRemoved: cells - uniq.length,
      cropped: cropped,
      tileset: ts,
      terrain: terrain,
      notWholeTiles: cropW !== w || cropH !== h,
      remainder: { x: w - cropW, y: h - cropH },
      ops: (function () {
        const ops = [];
        if (cropW !== w || cropH !== h) ops.push({ op: "crop", x: 0, y: 0, w: cropW, h: cropH });
        ops.push({ op: "slice", cols: cols, rows: rows, tile: T });
        if (cells - uniq.length > 0) ops.push({ op: "dedupe", removedCount: cells - uniq.length });
        return ops;
      })(),
    };
  }

  /** Detect walk-sheet style frames (mock-art detectFrames). */
  function detectFrames(w, h, T) {
    const cands = [];
    for (const fw of [T, T * 2]) {
      for (const fh of [T, T * 1.5, T * 2]) {
        if (w % fw || h % fh) continue;
        const cols = w / fw;
        const rows = h / fh;
        let score = (rows === 4 ? 4 : rows === 1 ? 2 : 0) + (cols === 3 || cols === 4 ? 3 : cols <= 8 ? 1 : 0) + (fw === T ? 1 : 0);
        cands.push({ fw: fw, fh: fh, cols: cols, rows: rows, score: score });
      }
    }
    cands.sort(function (a, b) {
      return b.score - a.score;
    });
    return cands[0] || null;
  }


  function alphaStats(canvas) {
    const w = canvas.width, h = canvas.height;
    const d = canvas.getContext("2d").getImageData(0, 0, w, h).data;
    let clear = 0, semi = 0;
    for (let i = 3; i < d.length; i += 4) {
      if (d[i] === 0) clear++;
      else if (d[i] < 255) semi++;
    }
    return { clear: clear, semi: semi, total: w * h, corner: [d[0], d[1], d[2], d[3]] };
  }

  function clipNames(rows, existing) {
    const n = Math.max(1, Math.min(8, rows | 0));
    const def =
      n === 4 ? ["down", "left", "right", "up"] :
      n === 1 ? ["idle"] :
      Array.from({ length: n }, function (_, i) { return "row " + (i + 1); });
    if (existing && existing.length === n) return existing.slice();
    return def;
  }

  /** Named presets for animation rows: walk, idle, attack. */
  function clipPresetNames(kind, rows) {
    const n = Math.max(1, Math.min(8, rows | 0));
    if (kind === "walk") {
      const walk = ["down", "left", "right", "up"];
      if (n === 4) return walk.slice();
      if (n === 1) return ["walk"];
      return Array.from({ length: n }, function (_, i) { return walk[i] || ("walk " + (i + 1)); });
    }
    if (kind === "idle") {
      if (n === 1) return ["idle"];
      return Array.from({ length: n }, function (_, i) { return i === 0 ? "idle" : "idle " + (i + 1); });
    }
    if (kind === "attack") {
      const atk = ["attack_down", "attack_left", "attack_right", "attack_up"];
      if (n === 4) return atk.slice();
      if (n === 1) return ["attack"];
      return Array.from({ length: n }, function (_, i) { return atk[i] || ("attack " + (i + 1)); });
    }
    return clipNames(n);
  }

  function colourName(hex) {
    if (!hex) return "that colour";
    const h = String(hex).toLowerCase();
    const named = {
      "#ff00ff": "magenta", "#f0f": "magenta", "#ff00ff00": "magenta",
      "#00ff00": "lime", "#0f0": "lime",
      "#000000": "black", "#000": "black",
      "#ffffff": "white", "#fff": "white",
      "#ff0000": "red", "#f00": "red",
      "#0000ff": "blue", "#00f": "blue",
      "#ffff00": "yellow", "#ff0": "yellow",
      "#00ffff": "cyan", "#0ff": "cyan",
    };
    if (named[h]) return named[h];
    // collapse short #rgb
    if (/^#[0-9a-f]{3}$/.test(h)) {
      const full = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
      if (named[full]) return named[full];
    }
    return "that colour";
  }

  function opPlainWords(o) {
    if (!o) return "";
    if (o.op === "crop") return "Crop to " + o.w + " × " + o.h;
    if (o.op === "pad") {
      const fill = o.fill === "transparent" || !o.fill ? "see-through" : colourName(o.fill);
      return "Pad +" + ((o.right || 0) + (o.left || 0)) + " × +" + ((o.top || 0) + (o.bottom || 0)) + " (" + fill + ")";
    }
    if (o.op === "scale") return "Zoom ×" + o.k;
    if (o.op === "colourKey") return "Make " + colourName(o.colour) + " see-through";
    if (o.op === "dedupe") return o.removedCount + " repeats removed";
    if (o.op === "cropFrames") return "Every frame cropped to its middle " + (o.rect && o.rect.w) + " px";
    if (o.op === "slice") return "Slice " + o.cols + " × " + o.rows;
    return o.op;
  }

  function opsText(ops) {
    return (ops || []).map(opPlainWords).join(" → ");
  }

  /** One fix-step line as HTML: numbered plain words + optional colour swatch. */
  function opsStepHtml(o, i) {
    const n = (i | 0) + 1;
    let swatch = "";
    if (o && o.op === "colourKey" && o.colour) {
      const col = String(o.colour).replace(/"/g, "");
      swatch = '<span class="op-swatch" style="background:' + col + '" title="' + col + '" aria-hidden="true"></span>';
    } else if (o && o.op === "pad" && o.fill && o.fill !== "transparent") {
      const col = String(o.fill).replace(/"/g, "");
      swatch = '<span class="op-swatch" style="background:' + col + '" title="' + col + '" aria-hidden="true"></span>';
    }
    return '<div class="fl-step">' + n + ". " + opPlainWords(o) + (swatch ? " " + swatch : "") + "</div>";
  }

  function applyOps(srcCanvas, ops) {
    let cur = draw(srcCanvas, srcCanvas.width, srcCanvas.height);
    (ops || []).forEach(function (o) {
      if (o.op === "crop") {
        cur = draw(cur, o.w, o.h, o.x || 0, o.y || 0, o.w, o.h);
      } else if (o.op === "pad") {
        const left = o.left || 0, top = o.top || 0, right = o.right || 0, bottom = o.bottom || 0;
        const c2 = canvasOf(cur.width + left + right, cur.height + top + bottom);
        const cx = c2.getContext("2d");
        if (o.fill && o.fill !== "transparent") {
          cx.fillStyle = o.fill;
          cx.fillRect(0, 0, c2.width, c2.height);
        }
        cx.drawImage(cur, left, top);
        cur = c2;
      } else if (o.op === "scale" && o.k >= 1 && Number.isInteger(o.k)) {
        const c2 = canvasOf(cur.width * o.k, cur.height * o.k);
        const cx = c2.getContext("2d");
        cx.imageSmoothingEnabled = false;
        cx.drawImage(cur, 0, 0, c2.width, c2.height);
        cur = c2;
      } else if (o.op === "colourKey") {
        const c2 = draw(cur, cur.width, cur.height);
        const cx = c2.getContext("2d");
        const d = cx.getImageData(0, 0, c2.width, c2.height);
        let r0, g0, b0;
        if (o.colour && /^#/.test(o.colour)) {
          const hex = o.colour.slice(1);
          r0 = parseInt(hex.slice(0, 2), 16);
          g0 = parseInt(hex.slice(2, 4), 16);
          b0 = parseInt(hex.slice(4, 6), 16);
        } else {
          r0 = d.data[0]; g0 = d.data[1]; b0 = d.data[2];
        }
        for (let i = 0; i < d.data.length; i += 4) {
          if (d.data[i] === r0 && d.data[i + 1] === g0 && d.data[i + 2] === b0) d.data[i + 3] = 0;
        }
        cx.putImageData(d, 0, 0);
        cur = c2;
      } else if (o.op === "cropFrames") {
        const fw = o.frame.w, fh = o.frame.h;
        const cols = Math.floor(cur.width / fw), rows = Math.floor(cur.height / fh);
        const rw = o.rect.w, rh = o.rect.h || fh;
        const ox = o.rect.x || 0, oy = o.rect.y || 0;
        const c2 = canvasOf(cols * rw, rows * rh);
        const cx = c2.getContext("2d");
        for (let r = 0; r < rows; r++) {
          for (let q = 0; q < cols; q++) {
            cx.drawImage(cur, q * fw + ox, r * fh + oy, rw, rh, q * rw, r * rh, rw, rh);
          }
        }
        cur = c2;
      }
    });
    return cur;
  }

  function cornerColourHex(canvas) {
    const d = canvas.getContext("2d").getImageData(0, 0, 1, 1).data;
    return "#" + [d[0], d[1], d[2]].map(function (n) { return n.toString(16).padStart(2, "0"); }).join("");
  }

  global.SpriteSlice = {
    canvasOf: canvasOf,
    draw: draw,
    cellHash: cellHash,
    previewZoom: previewZoom,
    showCanvas: showCanvas,
    loadImageFromFile: loadImageFromFile,
    loadImageFromUrl: loadImageFromUrl,
    autoSlice: autoSlice,
    detectFrames: detectFrames,
    applyOps: applyOps,
    opsText: opsText,
    opsStepHtml: opsStepHtml,
    colourName: colourName,
    clipNames: clipNames,
    clipPresetNames: clipPresetNames,
    alphaStats: alphaStats,
    cornerColourHex: cornerColourHex,
  };
})(typeof window !== "undefined" ? window : globalThis);
