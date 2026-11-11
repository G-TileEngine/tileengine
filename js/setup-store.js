/* Behaviour setup store — setup-format.md §11 (r2). Pure ops; no game logic. */
(function (global) {
  "use strict";

  const FORMAT_VERSION = 3;
  const HISTORY_CAP = 200;
  const PRESET_LIB_KEY = "tileengine.preset-library.v1";
  const PRESET_EMBED_KEY = "tileengine.preset-embed.v1";
  const HARD = new Set(["requiredUnanswered", "noDefault", "invalidValue"]);
  const EVENT_REASK = new Set(["parentChanged", "catalogueChanged", "renamed"]);
  const LEGACY_STORED_CHECKS = new Set(["noDefault", "outOfRange", "offStep", "bannedCombo"]);

  const nowIso = () => new Date().toISOString();
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const ulid = (p) => p + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const err = (code, extra) => ({ error: Object.assign({ code }, extra || {}) });
  const ok = (doc, changed, flagged, unflagged, extra) =>
    Object.assign({ doc, changed: changed || [], flagged: flagged || [], unflagged: unflagged || [] }, extra || {});

  function findBehaviour(catalogue, id) {
    return (catalogue.behaviours || []).find((b) => b.id === id) || null;
  }
  function knobMap(behaviour) {
    const m = {};
    (behaviour.knobs || []).forEach((k) => (m[k.id] = k));
    return m;
  }
  function decimals(n) {
    if (n == null || !Number.isFinite(Number(n))) return 0;
    const s = String(n);
    const i = s.indexOf(".");
    return i < 0 ? 0 : s.length - i - 1;
  }
  function interimStep(knob) {
    if (knob && knob.step != null && Number(knob.step) > 0) return Number(knob.step);
    const d = Math.max(decimals(knob && knob.min), decimals(knob && knob.max), decimals(knob && knob.default));
    return Math.pow(10, -d);
  }

  function previousDefault(knob) {
    const hist = knob && knob.default_history;
    if (!Array.isArray(hist) || hist.length < 2) return null;
    // history entries; last-but-one is previous
    return hist[hist.length - 2].default;
  }

  /** Knobs gated by depends_on until required behaviour/knob is available. */
  function dependencyGates(behaviour, projectBehavioursOn) {
    // projectBehavioursOn: Set of behaviour ids enabled in the project
    const out = {}; // knobId -> reason
    const on = projectBehavioursOn || new Set();
    (behaviour.knobs || []).forEach((k) => {
      (k.depends_on || []).forEach((dep) => {
        if (String(dep).includes(".")) {
          const bid = String(dep).split(".")[0];
          if (!on.has(bid) && bid !== behaviour.id) {
            out[k.id] = (k.depends_note && String(k.depends_note).trim()) || ("Needs " + bid.replace(/-/g, " ") + " first.");
          }
        }
        // same-behaviour knob deps are not greying — they're value deps handled by bans
      });
    });
    return out;
  }
  function nearestOnStep(v, min, step) {
    const base = min != null ? Number(min) : 0;
    const s = Number(step) || 1;
    const n = Math.round((Number(v) - base) / s);
    const nearest = base + n * s;
    const places = decimals(s);
    return Number(nearest.toFixed(places));
  }
  function onStep(v, min, step) {
    const base = min != null ? Number(min) : 0;
    const s = Number(step) || 1;
    const q = (Number(v) - base) / s;
    return Math.abs(q - Math.round(q)) < 1e-9;
  }
  function canonicalHash(behaviour) {
    const slice = { id: behaviour.id, knobs: behaviour.knobs, menu_order: behaviour.menu_order, banned_combos: behaviour.banned_combos };
    const s = JSON.stringify(slice);
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return ("000000000000" + h.toString(16)).slice(-12);
  }

  function answerState(a) {
    const o = { source: a.source, defaultRef: clone(a.defaultRef), needsReask: a.needsReask ? clone(a.needsReask) : null };
    if (a.source !== "default" && a.value !== undefined) o.value = a.value;
    if (a.source === "preset" && a.presetRef) o.presetRef = clone(a.presetRef);
    return o;
  }
  function applyState(a, state) {
    a.source = state.source;
    a.defaultRef = clone(state.defaultRef);
    a.needsReask = state.needsReask ? clone(state.needsReask) : null;
    if (state.source === "default") {
      delete a.value;
      delete a.presetRef;
    } else {
      a.value = state.value;
      if (state.source === "preset" && state.presetRef) a.presetRef = clone(state.presetRef);
      else delete a.presetRef;
    }
  }

  /** Effective value (r4): never clamped; event flags don't hide it. */
  function effective(answer, knob) {
    if (!knob || !answer) return undefined;
    if (answer.source === "default") return knob.default;
    return answer.value;
  }

  function validateValue(knob, value) {
    if (!knob) return err("unknownKnob");
    if (knob.type === "slider") {
      if (typeof value !== "number" || !Number.isFinite(value)) return err("invalidValue", { type: "number" });
      if (knob.min != null && value < knob.min) return err("invalidValue", { min: knob.min, max: knob.max });
      if (knob.max != null && value > knob.max) return err("invalidValue", { min: knob.min, max: knob.max });
      const step = interimStep(knob);
      if (!onStep(value, knob.min, step)) {
        return err("invalidValue", { step, nearest: nearestOnStep(value, knob.min, step) });
      }
    } else if (knob.type === "toggle") {
      if (typeof value !== "boolean") return err("invalidValue", { type: "boolean" });
    } else if (knob.type === "picker") {
      const opts = (knob.options || []).map((o) => (o && typeof o === "object" ? o.value : o));
      if (!opts.includes(value)) return err("invalidValue", { options: opts });
    } else if (knob.type === "colour" || knob.type === "color") {
      if (value === null && knob.nullable) return null;
      if (typeof value !== "string" || !String(value).trim()) return err("invalidValue", { type: "colour" });
    } else if (knob.type === "text") {
      if (typeof value !== "string") return err("invalidValue", { type: "text" });
      const maxLen = knob.max_len != null ? knob.max_len : 48;
      if (value.length > maxLen) return err("invalidValue", { type: "text", max_len: maxLen });
    } else if (knob.type === "list") {
      if (!Array.isArray(value)) return err("invalidValue", { type: "list" });
      const ids = {};
      const reserved = knob.reserved_ids || [];
      const defaultIds = new Set(
        (Array.isArray(knob.default) ? knob.default : []).map((it) => it && it.id).filter(Boolean)
      );
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        if (!item || typeof item !== "object" || !item.id || !item.label) return err("invalidValue", { type: "item" });
        if (ids[item.id]) return err("invalidValue", { type: "item" });
        ids[item.id] = true;
        // Reserved id only allowed when catalogue default has that built-in item
        if (reserved.indexOf(item.id) >= 0 && !defaultIds.has(item.id)) {
          return err("invalidValue", { type: "item", item: "reservedId" });
        }
      }
      // Soft max/min are warnings in checkAnswer — never hard here (unless max_items_hard)
      if (knob.max_items_hard && knob.max_items != null && value.length > knob.max_items) {
        return err("invalidValue", { type: "item", item: "overCapHard" });
      }
    } else if (knob.type === "ref") {
      if (typeof value !== "string") return err("invalidValue", { type: "ref" });
    }
    return null;
  }

  function compare(op, left, right) {
    switch (op) {
      case "eq": return left === right;
      case "ne": return left !== right;
      case "gt": return Number(left) > Number(right);
      case "gte": return Number(left) >= Number(right);
      case "lt": return Number(left) < Number(right);
      case "lte": return Number(left) <= Number(right);
      default: return false;
    }
  }

  function effectiveMap(doc, behaviour) {
    const knobs = knobMap(behaviour);
    const out = {};
    Object.keys(doc.answers).forEach((id) => {
      const a = doc.answers[id];
      const k = knobs[id];
      // For ban evaluation use stored/default even if flagged warning; blocking → use raw stored/default for when checks
      if (!k) return;
      if (a.source === "default") out[id] = k.default;
      else out[id] = a.value;
    });
    return out;
  }

  function childParents(behaviour) {
    const edges = {};
    const add = (c, p) => {
      if (!edges[c]) edges[c] = [];
      if (!edges[c].includes(p)) edges[c].push(p);
    };
    (behaviour.banned_combos || []).forEach((ban) => {
      const when = ban.when || {};
      const v = when.value;
      if (typeof v === "string" && v.startsWith("$") && !v.slice(1).includes(".") && when.knob) {
        add(when.knob, v.slice(1));
      }
    });
    (behaviour.knobs || []).forEach((k) => {
      (k.depends_on || []).forEach((dep) => {
        if (!String(dep).includes(".")) add(k.id, dep);
      });
    });
    return edges;
  }

  function runR1R2(doc, behaviour, changedKnobIds, at) {
    const flagged = [];
    const unflagged = [];
    const values = effectiveMap(doc, behaviour);
    const edges = childParents(behaviour);
    at = at || nowIso();

    changedKnobIds.forEach((parentId) => {
      Object.keys(edges).forEach((child) => {
        if (!edges[child].includes(parentId)) return;
        const a = doc.answers[child];
        if (!a || a.source === "default") return;
        a.needsReask = { reason: "parentChanged", by: { knob: parentId }, at };
        a.rev += 1;
        if (!flagged.includes(child)) flagged.push(child);
      });
    });

    (behaviour.banned_combos || []).forEach((ban, comboIndex) => {
      const when = ban.when || {};
      const disable = ban.disable || {};
      if (when.behaviour && when.behaviour !== behaviour.id) return;
      if (disable.behaviour && disable.behaviour !== behaviour.id && !disable.knob) return;
      let right = when.value;
      if (typeof right === "string" && right.startsWith("$")) {
        if (right.includes(".")) return;
        right = values[right.slice(1)];
      }
      const left = values[when.knob];
      const fires = compare(when.op || "eq", left, right);
      const target = disable.knob || when.knob;
      if (!target || !doc.answers[target]) return;
      if (fires) {
        const a = doc.answers[target];
        a.needsReask = {
          reason: "bannedCombo",
          by: { comboId: ban.id || String(comboIndex), comboIndex, behaviour: behaviour.id },
          at,
          note: ban.reason,
        };
        a.rev += 1;
        if (!flagged.includes(target)) flagged.push(target);
      } else if (
        doc.answers[target].needsReask &&
        doc.answers[target].needsReask.reason === "bannedCombo" &&
        doc.answers[target].needsReask.by &&
        doc.answers[target].needsReask.by.comboIndex === comboIndex
      ) {
        doc.answers[target].needsReask = null;
        doc.answers[target].rev += 1;
        unflagged.push(target);
      }
    });
    return { flagged, unflagged };
  }

  function bumpDoc(doc, kind, changes, extra) {
    const last = doc.history.ops[doc.history.ops.length - 1];
    const seq = last ? last.seq + 1 : Math.max(1, doc.history.baseSeq || 0);
    const op = Object.assign({ seq, at: nowIso(), kind, changes }, extra || {});
    doc.history.ops.push(op);
    while (doc.history.ops.length > doc.history.cap) {
      doc.history.ops.shift();
      doc.history.baseSeq = doc.history.ops[0] ? doc.history.ops[0].seq : seq;
    }
    doc.rev += 1;
    doc.updatedAt = op.at;
    return op;
  }

  function checkRev(doc, expectedRev) {
    if (expectedRev != null && expectedRev !== doc.rev) return err("staleRev", { currentRev: doc.rev });
    return null;
  }

  function emptyAnswer(knob) {
    // r4: validity is derived on read. needsReask stores event flags only.
    return {
      source: "default",
      rev: 0,
      defaultRef: { rev: knob && knob.rev != null ? knob.rev : 1 },
      needsReask: null,
    };
  }

  function createSetup(behaviourId, catalogue, name) {
    const behaviour = findBehaviour(catalogue, behaviourId);
    if (!behaviour) return err("wrongBehaviour", { behaviourId });
    const answers = {};
    (behaviour.knobs || []).forEach((k) => (answers[k.id] = emptyAnswer(k)));
    return {
      doc: {
        kind: "behaviour-setup",
        formatVersion: FORMAT_VERSION,
        id: ulid("setup"),
        rev: 0,
        name: String(name || behaviour.name || "Untitled setup").slice(0, 48),
        behaviourId,
        catalogue: {
          rev: catalogue.catalogue_rev != null ? catalogue.catalogue_rev : 0,
        },
        createdAt: nowIso(),
        updatedAt: nowIso(),
        copiedFrom: null,
        answers,
        orphans: {},
        history: { cap: HISTORY_CAP, baseSeq: 0, ops: [] },
      },
      notices: [],
      readOnly: false,
    };
  }

  function loadSetup(raw, catalogue) {
    const notices = [];
    let readOnly = false;
    if (!raw || typeof raw !== "object" || raw.kind !== "behaviour-setup") {
      return { doc: null, notices: ["Not a behaviour-setup"], readOnly: true };
    }
    if (raw.formatVersion > FORMAT_VERSION) {
      readOnly = true;
      notices.push("made by a newer TileEngine");
    }
    const doc = clone(raw);
    // Behaviour renamed_from before lookup (e.g. card-recursion → ability-refresh)
    (catalogue.behaviours || []).forEach((b) => {
      (b.renamed_from || []).forEach((oldId) => {
        if (doc.behaviourId === oldId) {
          doc.behaviourId = b.id;
          notices.push("behaviour renamed " + oldId + " → " + b.id);
        }
      });
    });
    let behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) {
      return { doc, notices: notices.concat(["behaviour retired"]), readOnly: true };
    }
    // Knob renamed_from: re-key answers, never drop
    (behaviour.knobs || []).forEach((k) => {
      (k.renamed_from || []).forEach((oldId) => {
        if (doc.answers[oldId] && !doc.answers[k.id]) {
          doc.answers[k.id] = doc.answers[oldId];
          delete doc.answers[oldId];
          notices.push("renamed " + oldId + " → " + k.id);
          const a = doc.answers[k.id];
          // Option renamed_from (L10): map old option values to new
          if (a && a.source !== "default" && Array.isArray(k.options)) {
            const hit = k.options.find(
              (o) => o && typeof o === "object" && Array.isArray(o.renamed_from) && o.renamed_from.indexOf(a.value) >= 0
            );
            if (hit) {
              a.value = hit.value;
              notices.push("option renamed → " + hit.value);
            }
          }
          if (a && !a.needsReask) {
            a.needsReask = { reason: "renamed", at: nowIso(), by: { knob: oldId } };
          }
        } else if (doc.answers[oldId] && doc.answers[k.id]) {
          // keep both briefly: move old to orphans rather than drop
          doc.orphans = doc.orphans || {};
          doc.orphans[oldId] = { answer: doc.answers[oldId], removedAtRev: null, reason: "renamed to " + k.id };
          delete doc.answers[oldId];
          notices.push("orphaned duplicate old key " + oldId);
        }
      });
    });

    const knobs = knobMap(behaviour);
    const moved = [];
    Object.keys(knobs).forEach((id) => {
      if (!doc.answers[id]) {
        doc.answers[id] = emptyAnswer(knobs[id]);
        notices.push("added default for " + id);
      }
    });
    // Option renamed_from for every stored answer (catalogue only — no hard-coded maps)
    Object.keys(doc.answers).forEach((id) => {
      const k = knobs[id];
      const a = doc.answers[id];
      if (!k || !a || a.source === "default" || !Array.isArray(k.options)) return;
      const hit = k.options.find(
        (o) => o && typeof o === "object" && Array.isArray(o.renamed_from) && o.renamed_from.indexOf(a.value) >= 0
      );
      if (hit && hit.value !== a.value) {
        notices.push("option " + id + ": " + a.value + " → " + hit.value);
        a.value = hit.value;
      }
    });
    // Honour retired_knobs tombstones (convert / fold before orphan)
    const retired = {};
    (behaviour.retired_knobs || []).forEach((r) => {
      if (r && r.id) retired[r.id] = r;
    });
    Object.keys(doc.answers).forEach((id) => {
      if (!knobs[id]) {
        const tomb = retired[id];
        const oldAns = doc.answers[id];
        let foldedMeta = null;
        if (tomb && tomb.convert && tomb.convert.to && knobs[tomb.convert.to]) {
          const dest = tomb.convert.to;
          const destKnob = knobs[dest];
          let converted = destKnob.default != null ? destKnob.default : "";
          if (tomb.convert.from === "first-item-field" && oldAns) {
            const eff = effective(oldAns, { type: "list", default: [] });
            if (Array.isArray(eff) && eff[0] && eff[0][tomb.convert.field] != null) {
              converted = String(eff[0][tomb.convert.field]);
            }
          }
          // Carry source / presetRef (§10.13) — never invent a user answer from a default
          if (!doc.answers[dest] || doc.answers[dest].source === "default") {
            if (oldAns && oldAns.source === "default") {
              doc.answers[dest] = emptyAnswer(destKnob);
            } else {
              const a = {
                source: oldAns.source || "user",
                rev: (doc.answers[dest] && doc.answers[dest].rev) || 0,
                value: converted,
                defaultRef: { rev: destKnob.rev != null ? destKnob.rev : 1 },
                needsReask: { reason: "renamed", at: nowIso(), by: { knob: id }, note: "converted " + id + " → " + dest },
              };
              if (oldAns.presetRef) a.presetRef = clone(oldAns.presetRef);
              doc.answers[dest] = a;
            }
            notices.push("converted " + id + " → " + dest);
          }
        }
        if (tomb && tomb.fold && tomb.fold.into && knobs[tomb.fold.into]) {
          const dest = tomb.fold.into;
          const destKnob = knobs[dest];
          const toggleOn = !!(oldAns && effective(oldAns, { type: "toggle", default: false }) === true);
          const intoBefore = doc.answers[dest] ? clone(doc.answers[dest]) : emptyAnswer(destKnob);
          if (!toggleOn && tomb.fold.when_false === "reset") {
            // Keep any user colour in folded.previous so it can be restored
            if (intoBefore.source !== "default") {
              foldedMeta = { into: dest, previous: intoBefore };
            }
            doc.answers[dest] = emptyAnswer(destKnob);
            notices.push("fold " + id + " false → reset " + dest);
          } else if (toggleOn) {
            // Override was on: make the colour explicit as user if it was still default
            const intoEff = effective(intoBefore, destKnob);
            if (intoBefore.source === "default" && intoEff != null) {
              doc.answers[dest] = {
                source: "user",
                rev: (intoBefore.rev | 0) + 1,
                value: intoEff,
                defaultRef: { rev: destKnob.rev != null ? destKnob.rev : 1 },
                needsReask: {
                  reason: "renamed",
                  at: nowIso(),
                  by: { knob: id },
                  note: "folded: override was on, kept the rev 8 colour",
                },
              };
              notices.push("fold " + id + " on → kept " + dest);
            } else if (intoBefore.source === "default" && intoEff == null && destKnob.nullable) {
              // already null/palette — leave as default null
              doc.answers[dest] = emptyAnswer(destKnob);
            }
            foldedMeta = { into: dest, previous: intoBefore };
          }
        }
        doc.orphans = doc.orphans || {};
        const orphanRec = {
          answer: oldAns,
          removedAtRev: tomb && tomb.since_rev != null ? tomb.since_rev : null,
          reason: tomb ? (tomb.reason || ("tombstone: " + id)) : "removed from catalogue",
        };
        if (foldedMeta) orphanRec.folded = foldedMeta;
        doc.orphans[id] = orphanRec;
        delete doc.answers[id];
        notices.push(tomb ? "tombstoned " + id + " (kept hidden)" : "orphaned " + id);
        return;
      }
      const a = doc.answers[id];
      const k = knobs[id];
      if (a.source === "default") {
        // D3: follow new default silently; notice if hash differed — we can't know old default without knobHash
        if ("value" in a) delete a.value;
        if (k.default == null && !k.nullable) {
          a.needsReask = { reason: "noDefault", at: nowIso(), note: k.no_default_reason || undefined };
        } else if (a.needsReask && a.needsReask.reason === "noDefault") {
          // Default present → satisfied (required no longer mimics noDefault)
          a.needsReask = null;
        }
      } else {
        // validate stored value
        const bad = validateValue(k, a.value);
        if (bad && bad.error) {
          const reason = bad.error.step != null ? "offStep" : "outOfRange";
          a.needsReask = {
            reason,
            at: nowIso(),
            note: bad.error.nearest != null ? "nearest " + bad.error.nearest : undefined,
          };
        }
      }
    });

    // Item-field migrations (rev 10): retired_item_fields + value_converters (§8.2 / §10.14)
    (behaviour.knobs || []).forEach((k) => {
      const a = doc.answers[k.id];
      if (!a || a.source === "default" || !Array.isArray(a.value)) return;
      let changed = false;
      const booth = (() => {
        const bc = doc.answers.booth_caster;
        const bk = knobs.booth_caster;
        const v = bc ? effective(bc, bk || { default: { c: 0, r: 0 } }) : { c: 0, r: 0 };
        return { c: (v && v.c) | 0, r: (v && v.r) | 0 };
      })();
      (k.retired_item_fields || []).forEach((rif) => {
        if (!rif || !rif.id) return;
        a.value.forEach((item) => {
          if (!item || typeof item !== "object" || !(rif.id in item)) return;
          const oldVal = item[rif.id];
          if (rif.convert && rif.convert.to) {
            const mapped = rif.convert.map && rif.convert.map[oldVal] != null ? rif.convert.map[oldVal] : oldVal;
            item[rif.convert.to] = mapped;
            // board → relative points when convert.points mentions board
            if (oldVal === "board" && rif.convert.points) {
              ["trace_points", "bounce_points", "reel_links"].forEach((pf) => {
                if (!Array.isArray(item[pf])) return;
                item[pf] = item[pf].map((pt) => {
                  if (!pt || typeof pt !== "object") return pt;
                  if ("dc" in pt || "dr" in pt) return pt;
                  return { dc: (pt.c | 0) - booth.c, dr: (pt.r | 0) - booth.r };
                });
              });
              ["reel_land", "reel_tie"].forEach((pf) => {
                const pt = item[pf];
                if (!pt || typeof pt !== "object") return;
                if ("dc" in pt || "dr" in pt) return;
                item[pf] = { dc: (pt.c | 0) - booth.c, dr: (pt.r | 0) - booth.r };
              });
            }
          }
          delete item[rif.id];
          changed = true;
        });
      });
      (k.value_converters || []).forEach((vc) => {
        if (!vc || !Array.isArray(vc.fields)) return;
        const pinRev = a.defaultRef && a.defaultRef.rev != null ? a.defaultRef.rev : 0;
        if (vc.since_rev != null && pinRev >= vc.since_rev) return;
        a.value.forEach((item) => {
          if (!item || typeof item !== "object") return;
          vc.fields.forEach((pf) => {
            const pt = item[pf];
            if (Array.isArray(pt)) {
              item[pf] = pt.map((p) => {
                if (!p || typeof p !== "object") return p;
                if ("dc" in p || "dr" in p) return p;
                if (!("c" in p) && !("r" in p)) return p;
                return { dc: (p.c | 0) - booth.c, dr: (p.r | 0) - booth.r };
              });
              changed = true;
            } else if (pt && typeof pt === "object" && !("dc" in pt) && ("c" in pt || "r" in pt)) {
              item[pf] = { dc: (pt.c | 0) - booth.c, dr: (pt.r | 0) - booth.r };
              changed = true;
            }
          });
        });
        if (changed) {
          a.needsReask = {
            reason: "catalogueChanged",
            at: nowIso(),
            note: "value_converters: {c,r} → {dc,dr}",
          };
          a.defaultRef = { rev: k.rev != null ? k.rev : pinRev };
        }
      });
      if (changed) notices.push("migrated item fields on " + k.id);
    });

    // Defaults moved banner when pin hash differs (old defaults unknown → ?)
    {
      const movedLines = [];
      (behaviour.knobs || []).forEach((k) => {
        const prev = previousDefault(k);
        if (prev !== null && prev !== k.default) {
          movedLines.push(k.label + " " + String(prev) + " → " + String(k.default));
        }
      });
      if (movedLines.length) {
        notices.push("Defaults moved: " + movedLines.slice(0, 6).join(", ") + (movedLines.length > 6 ? "…" : ""));
      } else if (doc.catalogue && doc.catalogue.behaviourHash && doc.catalogue.behaviourHash !== canonicalHash(behaviour)) {
        notices.push("Defaults moved: catalogue defaults updated.");
      }
    }
    // migrate to formatVersion 3 (setup-format r4): drop stored validity flags
    if (doc.formatVersion < 2) {
      doc.formatVersion = 2;
      notices.push("migrated to formatVersion 2");
    }
    if (doc.formatVersion < 3) {
      Object.keys(doc.answers || {}).forEach((id) => {
        const a = doc.answers[id];
        if (a && a.needsReask && LEGACY_STORED_CHECKS.has(a.needsReask.reason)) {
          a.needsReask = null;
        }
      });
      doc.formatVersion = 3;
      notices.push("migrated to formatVersion 3 (derive-checks)");
    }
    doc.catalogue = {
      rev: catalogue.catalogue_rev != null ? catalogue.catalogue_rev : 0,
    };
    if (!doc.history) doc.history = { cap: HISTORY_CAP, baseSeq: 0, ops: [] };
    return { doc, notices, readOnly };
  }

  function viewSetup(doc, catalogue) {
    const behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) return [];
    const knobs = knobMap(behaviour);
    return (behaviour.menu_order || []).map((step) => {
      const question = step.question || String(step);
      const ids = step.knob_ids || [];
      return {
        question,
        rows: ids
          .map((knobId) => {
            const knob = knobs[knobId];
            const answer = doc.answers[knobId];
            if (!knob || !answer) return null;
            const blocking = !!(answer.needsReask && HARD.has(answer.needsReask.reason));
            return {
              knobId,
              label: knob.label,
              type: knob.type,
              min: knob.min,
              max: knob.max,
              step: interimStep(knob),
              options: knob.options,
              default: knob.default,
              status: knob.status,
              effective: effective(answer, knob),
              stored: answer.source === "default" ? knob.default : answer.value,
              source: answer.source,
              isDefault: answer.source === "default",
              presetName: answer.presetRef ? answer.presetRef.name : undefined,
              presetRev: answer.presetRef ? answer.presetRef.presetRev : undefined,
              needsReask: answer.needsReask,
              blocking,
              canReset: answer.source !== "default",
              question,
            };
          })
          .filter(Boolean),
      };
    });
  }


  function gateValues(doc, behaviour, presentationStyle, catalogue) {
    const values = effectiveMap(doc, behaviour);
    return { values, presentationStyle: presentationStyle || "unit-action-menu" };
  }

  function answerIsActive(knob, doc, behaviour, presentationStyle, crossValues, catalogue) {
    if (!knob) return true;
    const values = effectiveMap(doc, behaviour);
    const cross = Object.assign(
      { "ability-presentation": { style: presentationStyle || "unit-action-menu", shortcut: presentationStyle || "all-menu" } },
      crossValues || {}
    );
    return isKnobActive(knob, values, presentationStyle || "all-menu", cross, catalogue);
  }

  function checkAnswer(knob, answer, values, presentationStyle, crossValues, behaviour, doc, catalogue) {
    if (!knob || !answer) return null;
    if (!answerIsActive(knob, doc, behaviour, presentationStyle, crossValues, catalogue)) return null;
    const eff = effective(answer, knob);
    // hard: required unanswered
    if (knob.required === true && answer.source === "default") {
      return { code: "requiredUnanswered", severity: "hard", knobId: knob.id, label: knob.label, value: eff };
    }
    if (knob.default == null && !knob.nullable && answer.source === "default") {
      return { code: "noDefault", severity: "hard", knobId: knob.id, label: knob.label, value: eff };
    }
    if (answer.source !== "default") {
      const bad = validateValue(knob, answer.value);
      if (bad && bad.error) {
        if (bad.error.type === "invalidValue" || bad.error.kind === "invalidValue" || (knob.type === "picker" && bad.error)) {
          // distinguish
          if (knob.type === "slider") {
            if (bad.error.min != null || bad.error.max != null || bad.error.type === "outOfRange") {
              return { code: "outOfRange", severity: "warning", knobId: knob.id, label: knob.label, value: answer.value };
            }
            if (bad.error.step != null || bad.error.type === "offStep") {
              return { code: "offStep", severity: "warning", knobId: knob.id, label: knob.label, value: answer.value };
            }
          }
          return { code: "invalidValue", severity: "hard", knobId: knob.id, label: knob.label, value: answer.value };
        }
      }
      // slider range/step as warnings even if validateValue returns them
      if (knob.type === "slider" && typeof answer.value === "number") {
        if ((knob.min != null && answer.value < knob.min) || (knob.max != null && answer.value > knob.max)) {
          return { code: "outOfRange", severity: "warning", knobId: knob.id, label: knob.label, value: answer.value };
        }
        const step = interimStep(knob);
        if (step > 0) {
          const n = (answer.value - (knob.min || 0)) / step;
          if (Math.abs(n - Math.round(n)) > 1e-9) {
            return { code: "offStep", severity: "warning", knobId: knob.id, label: knob.label, value: answer.value };
          }
        }
      }
      if (knob.type === "picker" && Array.isArray(knob.options)) {
        const ok = knob.options.some((o) => (typeof o === "object" ? o.value : o) === answer.value);
        if (!ok) return { code: "invalidValue", severity: "hard", knobId: knob.id, label: knob.label, value: answer.value };
      }
      if (knob.type === "list" && Array.isArray(answer.value)) {
        const max = knob.max_items != null ? knob.max_items : knob.max;
        const min = knob.min_items != null ? knob.min_items : null;
        if (max != null && answer.value.length > max) {
          return {
            code: "overCap",
            severity: knob.max_items_hard ? "hard" : "warning",
            knobId: knob.id,
            label: knob.label,
            value: answer.value,
            note: answer.value.length + " items (max " + max + ") — extras stay, first " + max + " used",
          };
        }
        if (min != null && answer.value.length < min) {
          return {
            code: "underCap",
            severity: "warning",
            knobId: knob.id,
            label: knob.label,
            value: answer.value,
            note: answer.value.length + " items (min " + min + ")",
          };
        }
        const reserved = knob.reserved_ids || [];
        const have = new Set(answer.value.map((it) => it && it.id));
        const missing = reserved.filter((id) => {
          const inDefault = (knob.default || []).some((it) => it && it.id === id);
          return inDefault && !have.has(id);
        });
        if (missing.length) {
          return {
            code: "reservedMissing",
            severity: "warning",
            knobId: knob.id,
            label: knob.label,
            value: answer.value,
            note: "missing built-in: " + missing.join(", "),
          };
        }
      }
    } else if (knob.type === "list") {
      // source default — still check min against effective length
      const effList = Array.isArray(eff) ? eff : [];
      const min = knob.min_items != null ? knob.min_items : null;
      if (min != null && effList.length < min) {
        return {
          code: "underCap",
          severity: "warning",
          knobId: knob.id,
          label: knob.label,
          value: effList,
          note: effList.length + " items (min " + min + ")",
        };
      }
    }
    return null;
  }

  function check(doc, catalogue, presentationStyle, crossValues) {
    const behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) return [];
    const style = presentationStyle || (catalogue && catalogue._presentationStyle) || "all-menu";
    const rows = [];
    (behaviour.knobs || []).forEach((knob) => {
      const a = doc.answers[knob.id];
      const row = checkAnswer(knob, a, null, style, crossValues, behaviour, doc, catalogue);
      if (row) {
        row.question = knob.label;
        rows.push(row);
      }
    });
    // bans as warnings
    try {
      const bans = disabledByBans(doc, catalogue) || {};
      Object.keys(bans).forEach((knobId) => {
        const b = bans[knobId];
        if (!b) return;
        rows.push({
          code: "bannedCombo",
          severity: "warning",
          knobId,
          label: b.label || knobId,
          question: b.reason || b.label || "Banned combo",
          by: b.by || { banId: b.banId },
        });
      });
    } catch (e) {}
    return rows;
  }

  function listMissing(doc, catalogue) {
    const rows = check(doc, catalogue);
    return rows
      .filter((r) => r.severity === "hard")
      .map((r) => ({
        knobId: r.knobId,
        label: r.label,
        question: r.question || r.label,
        reason: r.code,
        code: r.code,
        allowed: {},
        value: r.value,
        note: r.note,
      }));
  }

  function readiness(doc, catalogue) {
    const rows = check(doc, catalogue);
    const missing = rows.filter((r) => r.severity === "hard").map((r) => ({
      knobId: r.knobId, label: r.label, question: r.question || r.label, reason: r.code, code: r.code, value: r.value,
    }));
    const warnings = rows.filter((r) => r.severity === "warning");
    return { playable: missing.length === 0, missing, warnings };
  }

  function listNeedsReask(doc, catalogue) {
    const behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) return [];
    const knobs = knobMap(behaviour);
    const blocking = [];
    const warnings = [];
    const push = (id, question) => {
      const a = doc.answers[id];
      if (!a || !a.needsReask) return;
      const kn = knobs[id];
      const style = (catalogue && catalogue._presentationStyle) || "unit-action-menu";
      const active = !kn || answerIsActive(kn, doc, behaviour, style);
      const row = {
        knobId: id,
        label: knobs[id] ? knobs[id].label : id,
        question: question || (knobs[id] && knobs[id].label) || id,
        reason: a.needsReask.reason,
        // hard error only while active; inactive required/noDefault is not blocking
        blocking: active && HARD.has(a.needsReask.reason),
        inactive: !active,
        by: a.needsReask.by,
        note: a.needsReask.note,
        value: a.value,
        effective: effective(a, knobs[id]),
        stored: a.source === "default" ? (knobs[id] && knobs[id].default) : a.value,
      };
      if (!active) return; // inactive answers: keep stored, no reask surface
      (row.blocking ? blocking : warnings).push(row);
    };
    const seen = new Set();
    (behaviour.menu_order || []).forEach((step) => {
      (step.knob_ids || []).forEach((id) => {
        if (seen.has(id)) return;
        seen.add(id);
        push(id, step.question);
      });
    });
    Object.keys(doc.answers).forEach((id) => {
      if (!seen.has(id)) push(id);
    });
    return blocking.concat(warnings);
  }

  function editAnswer(doc, knobId, value, expectedRev, catalogue) {
    if (doc._readOnly) return err("readOnly");
    const revErr = checkRev(doc, expectedRev);
    if (revErr) return revErr;
    const behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) return err("wrongBehaviour");
    const knob = knobMap(behaviour)[knobId];
    if (!knob) return err("unknownKnob", { knobId });
    const bad = validateValue(knob, value);
    if (bad) return bad;

    // store rounded to step decimals for sliders
    if (knob.type === "slider") {
      const step = interimStep(knob);
      value = Number(Number(value).toFixed(decimals(step)));
    }

    const working = clone(doc);
    const a = working.answers[knobId];
    const before = answerState(a);
    const hadFlag = !!a.needsReask;
    a.source = "user";
    a.value = value;
    delete a.presetRef;
    a.needsReask = null;
    a.rev += 1;
    const changes = [{ knob: knobId, before, after: answerState(a) }];
    const { flagged, unflagged } = runR1R2(working, behaviour, [knobId], nowIso());
    bumpDoc(working, "set", changes);
    return ok(working, [knobId], flagged, hadFlag ? unflagged.concat([knobId]) : unflagged);
  }

  function resetAnswer(doc, knobId, catalogue) {
    const behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) return err("wrongBehaviour");
    if (!doc.answers[knobId]) return err("unknownKnob", { knobId });
    if (doc.answers[knobId].source === "default" && !(doc.answers[knobId].needsReask && doc.answers[knobId].needsReask.reason === "noDefault")) {
      // already default; if noDefault keep
      if (knobMap(behaviour)[knobId].default != null) return ok(doc, [], [], []);
    }
    const working = clone(doc);
    const knob = knobMap(behaviour)[knobId];
    const a = working.answers[knobId];
    const before = answerState(a);
    a.source = "default";
    delete a.value;
    delete a.presetRef;
    a.needsReask = null; // validity derived
    a.rev += 1;
    const changes = [{ knob: knobId, before, after: answerState(a) }];
    const { flagged, unflagged } = runR1R2(working, behaviour, [knobId], nowIso());
    bumpDoc(working, "reset", changes);
    return ok(working, [knobId], flagged, unflagged);
  }

  function resolveReask(doc, knobId, value, catalogue) {
    const behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) return err("wrongBehaviour");
    if (!doc.answers[knobId]) return err("unknownKnob", { knobId });
    const working = clone(doc);
    const a = working.answers[knobId];
    const knob = knobMap(behaviour)[knobId];
    const before = answerState(a);
    if (value !== undefined) {
      const bad = validateValue(knob, value);
      if (bad) return bad;
      a.source = "user";
      a.value = value;
      delete a.presetRef;
    } else if (a.needsReask && HARD.has(a.needsReask.reason) && a.source === "default") {
      // Keep on blocking noDefault without value is not enough — need a value
      return err("invalidValue", { type: "required" });
    }
    a.needsReask = null;
    a.rev += 1;
    bumpDoc(working, "resolve", [{ knob: knobId, before, after: answerState(a) }]);
    const { flagged, unflagged } = runR1R2(working, behaviour, [knobId], nowIso());
    return ok(working, [knobId], flagged, unflagged.concat([knobId]));
  }

  function forwardKinds(kind) {
    return ["set", "reset", "resolve", "preset", "presetUpdate", "flag"].includes(kind);
  }

  function canUndo(doc) {
    const ops = doc.history.ops;
    const undone = new Set();
    for (let i = ops.length - 1; i >= 0; i--) {
      const op = ops[i];
      if (op.kind === "migrate") return false;
      if (op.kind === "undo") {
        undone.add(op.target);
        continue;
      }
      if (op.kind === "redo") {
        undone.delete(op.target);
        continue;
      }
      if (forwardKinds(op.kind) && !undone.has(op.seq) && op.seq >= (doc.history.baseSeq || 0)) return true;
    }
    return false;
  }

  function canRedo(doc) {
    const ops = doc.history.ops;
    for (let i = ops.length - 1; i >= 0; i--) {
      if (forwardKinds(ops[i].kind)) return false;
      if (ops[i].kind === "undo") {
        return !ops.some((o) => o.kind === "redo" && o.target === ops[i].seq);
      }
    }
    return false;
  }

  function undo(doc) {
    if (!canUndo(doc)) return err("nothingToUndo");
    const working = clone(doc);
    const ops = working.history.ops;
    const undone = new Set();
    let targetOp = null;
    for (let i = ops.length - 1; i >= 0; i--) {
      const op = ops[i];
      if (op.kind === "migrate") return err("nothingToUndo");
      if (op.kind === "undo") {
        undone.add(op.target);
        continue;
      }
      if (op.kind === "redo") {
        undone.delete(op.target);
        continue;
      }
      if (forwardKinds(op.kind) && !undone.has(op.seq)) {
        targetOp = op;
        break;
      }
    }
    if (!targetOp) return err("nothingToUndo");
    const changes = [];
    targetOp.changes.forEach((ch) => {
      const a = working.answers[ch.knob];
      if (!a) return;
      const before = answerState(a);
      applyState(a, ch.before);
      a.rev += 1;
      changes.push({ knob: ch.knob, before, after: answerState(a) });
    });
    bumpDoc(working, "undo", changes, { target: targetOp.seq });
    return ok(working, changes.map((c) => c.knob), [], []);
  }

  function redo(doc) {
    if (!canRedo(doc)) return err("nothingToRedo");
    const working = clone(doc);
    const ops = working.history.ops;
    let undoOp = null;
    for (let i = ops.length - 1; i >= 0; i--) {
      if (forwardKinds(ops[i].kind)) return err("nothingToRedo");
      if (ops[i].kind === "undo") {
        undoOp = ops[i];
        break;
      }
    }
    if (!undoOp) return err("nothingToRedo");
    const original = ops.find((o) => o.seq === undoOp.target);
    if (!original) return err("nothingToRedo");
    const changes = [];
    original.changes.forEach((ch) => {
      const a = working.answers[ch.knob];
      if (!a) return;
      const before = answerState(a);
      applyState(a, ch.after);
      a.rev += 1;
      changes.push({ knob: ch.knob, before, after: answerState(a) });
    });
    bumpDoc(working, "redo", changes, { target: undoOp.seq });
    return ok(working, changes.map((c) => c.knob), [], []);
  }

  function duplicate(doc, name) {
    const copy = clone(doc);
    copy.id = ulid("setup");
    copy.name = String(name || doc.name + " copy").slice(0, 48);
    copy.copiedFrom = { setupId: doc.id, rev: doc.rev, at: nowIso() };
    copy.rev = 0;
    Object.keys(copy.answers).forEach((id) => (copy.answers[id].rev = 0));
    copy.history = { cap: HISTORY_CAP, baseSeq: 0, ops: [] };
    copy.createdAt = nowIso();
    copy.updatedAt = copy.createdAt;
    return ok(copy, [], [], []);
  }

  function readLib() {
    try {
      return JSON.parse(localStorage.getItem(PRESET_LIB_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function writeLib(list) {
    localStorage.setItem(PRESET_LIB_KEY, JSON.stringify(list));
  }
  function readEmbed() {
    try {
      return JSON.parse(localStorage.getItem(PRESET_EMBED_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function writeEmbed(map) {
    localStorage.setItem(PRESET_EMBED_KEY, JSON.stringify(map));
  }
  function embedPreset(preset) {
    const map = readEmbed();
    map[preset.id + "@" + preset.rev] = preset;
    writeEmbed(map);
  }

  function savePreset(doc, name, knobIds) {
    const n = String(name || "").trim().slice(0, 48);
    if (!n) return err("invalidValue", { type: "name" });
    const lib = readLib();
    if (lib.some((p) => p.behaviourId === doc.behaviourId && p.name === n)) return err("duplicateName", { name: n });
    const answers = {};
    const ids =
      knobIds && knobIds.length
        ? knobIds
        : Object.keys(doc.answers).filter((id) => doc.answers[id].source !== "default");
    ids.forEach((id) => {
      const a = doc.answers[id];
      if (!a) return;
      answers[id] = a.source === "default" ? { reset: true } : { value: a.value };
    });
    const preset = {
      kind: "behaviour-preset",
      formatVersion: 1,
      id: ulid("preset"),
      rev: 1,
      name: n,
      behaviourId: doc.behaviourId,
      catalogue: clone(doc.catalogue),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      answers,
    };
    lib.push(preset);
    writeLib(lib);
    return { preset, doc, changed: [], flagged: [], unflagged: [] };
  }

  function applyPreset(doc, preset, mode, catalogue) {
    mode = mode || "overlay";
    if (preset.behaviourId !== doc.behaviourId) return err("wrongBehaviour");
    const behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) return err("wrongBehaviour");
    const knobs = knobMap(behaviour);
    const working = clone(doc);
    const changes = [];
    const skipped = [];
    const touched = [];
    Object.keys(preset.answers || {}).forEach((id) => {
      const entry = preset.answers[id];
      const knob = knobs[id];
      if (!knob) {
        skipped.push({ knob: id, why: "unknownKnob" });
        return;
      }
      const a = working.answers[id];
      if (mode === "fillUnset" && a.source !== "default") return;
      if (entry && entry.reset) {
        const before = answerState(a);
        a.source = "default";
        delete a.value;
        delete a.presetRef;
        a.needsReask = null; // validity derived
        a.rev += 1;
        changes.push({ knob: id, before, after: answerState(a) });
        touched.push(id);
        return;
      }
      const value = entry && entry.value;
      const bad = validateValue(knob, value);
      if (bad) {
        skipped.push({ knob: id, why: "invalidValue", detail: bad.error });
        return;
      }
      const before = answerState(a);
      a.source = "preset";
      a.value = value;
      a.presetRef = { presetId: preset.id, presetRev: preset.rev, name: preset.name };
      a.needsReask = null;
      a.rev += 1;
      changes.push({ knob: id, before, after: answerState(a) });
      touched.push(id);
    });
    const { flagged, unflagged } = runR1R2(working, behaviour, touched, nowIso());
    bumpDoc(working, "preset", changes, {
      presetRef: { presetId: preset.id, presetRev: preset.rev, name: preset.name },
    });
    embedPreset(preset);
    return ok(working, touched, flagged, unflagged, { skipped });
  }

  function diffPreset(doc, preset, catalogue) {
    const behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) return [];
    const knobs = knobMap(behaviour);
    return Object.keys(preset.answers || {}).map((id) => {
      const entry = preset.answers[id];
      const knob = knobs[id];
      const a = doc.answers[id];
      const setupEff = a ? (a.source === "default" ? (knob && knob.default) : a.value) : undefined;
      const presetVal = entry && entry.reset ? (knob && knob.default) : entry && entry.value;
      let status = "differs";
      if (!knob) status = "invalid";
      else if (entry && !entry.reset && validateValue(knob, entry.value)) status = "invalid";
      else if (setupEff === presetVal) status = "same";
      else if (a && a.source === "user") status = "userOverrode";
      return {
        knob: id,
        label: knob ? knob.label : id,
        setup: a
          ? { source: a.source, effective: setupEff, presetRef: a.presetRef }
          : { source: "default", effective: undefined },
        preset: entry && entry.reset ? { reset: true } : { value: entry && entry.value },
        status,
        appliedFromRev: a && a.presetRef ? a.presetRef.presetRev : null,
      };
    });
  }

  function updateFromPreset(doc, preset, knobIds, catalogue) {
    if (preset.behaviourId !== doc.behaviourId) return err("wrongBehaviour");
    const behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) return err("wrongBehaviour");
    const knobs = knobMap(behaviour);
    const working = clone(doc);
    const changes = [];
    const touched = [];
    const skipped = [];
    (knobIds || []).forEach((id) => {
      const entry = preset.answers[id];
      if (!entry) return;
      const knob = knobs[id];
      const a = working.answers[id];
      if (!knob || !a) {
        skipped.push({ knob: id, why: "unknownKnob" });
        return;
      }
      if (entry.reset) {
        const before = answerState(a);
        a.source = "default";
        delete a.value;
        delete a.presetRef;
        a.needsReask = null; // validity derived
        a.rev += 1;
        changes.push({ knob: id, before, after: answerState(a) });
        touched.push(id);
        return;
      }
      const bad = validateValue(knob, entry.value);
      if (bad) {
        skipped.push({ knob: id, why: "invalidValue", detail: bad.error });
        return;
      }
      const before = answerState(a);
      a.source = "preset";
      a.value = entry.value;
      a.presetRef = { presetId: preset.id, presetRev: preset.rev, name: preset.name };
      a.needsReask = null;
      a.rev += 1;
      changes.push({ knob: id, before, after: answerState(a) });
      touched.push(id);
    });
    const { flagged, unflagged } = runR1R2(working, behaviour, touched, nowIso());
    bumpDoc(working, "presetUpdate", changes, {
      presetRef: { presetId: preset.id, presetRev: preset.rev, name: preset.name },
    });
    embedPreset(preset);
    return ok(working, touched, flagged, unflagged, { skipped });
  }

  function listPresets(behaviourId) {
    return readLib()
      .filter((p) => !behaviourId || p.behaviourId === behaviourId)
      .map((p) => ({
        id: p.id,
        name: p.name,
        libraryRev: p.rev,
        behaviourId: p.behaviourId,
        knobCount: Object.keys(p.answers || {}).length,
        embeddedRevs: Object.keys(readEmbed())
          .filter((k) => k.startsWith(p.id + "@"))
          .map((k) => Number(k.split("@")[1])),
        conflict: "none",
        _raw: p,
      }));
  }

  function getPreset(id) {
    return readLib().find((p) => p.id === id) || null;
  }

  function describeSetup(doc, catalogue) {
    const behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) return doc.name || "Setup";
    const ready = readiness(doc, catalogue);
    const knobs = knobMap(behaviour);
    let head;
    if (!ready.playable) {
      head =
        behaviour.name +
        " '" +
        doc.name +
        "' can't be played yet: " +
        ready.missing.length +
        " answer" +
        (ready.missing.length === 1 ? "" : "s") +
        " missing (" +
        ready.missing.map((m) => m.label).join(", ") +
        "). ";
    } else {
      head = behaviour.name + " '" + doc.name + "' is ready to play. ";
    }
    const parts = Object.keys(doc.answers).map((id) => {
      const a = doc.answers[id];
      const k = knobs[id];
      if (!k) return "";
      const eff = a.source === "default" ? k.default : a.value;
      let src =
        a.source === "default"
          ? "default"
          : a.source === "preset"
            ? "preset '" + (a.presetRef && a.presetRef.name) + "'"
            : "you set it";
      let re = a.needsReask ? "; re-check: " + (a.needsReask.note || a.needsReask.reason) : "";
      return k.label + " " + String(eff) + " (" + src + re + ")";
    });
    return head + parts.filter(Boolean).join(". ") + ".";
  }

  function disabledByBans(doc, catalogue) {
    const behaviour = findBehaviour(catalogue, doc.behaviourId);
    if (!behaviour) return {};
    const values = effectiveMap(doc, behaviour);
    const disabled = {};
    (behaviour.banned_combos || []).forEach((ban) => {
      const when = ban.when || {};
      const disable = ban.disable || {};
      if (when.behaviour && when.behaviour !== behaviour.id) return;
      let right = when.value;
      if (typeof right === "string" && right.startsWith("$")) {
        if (right.includes(".")) return;
        right = values[right.slice(1)];
      }
      if (!compare(when.op || "eq", values[when.knob], right)) return;
      if (disable.knob) {
        if (disable.value !== undefined) disabled[disable.knob + "::" + String(disable.value)] = ban.reason;
        else disabled[disable.knob] = ban.reason;
      }
    });
    return disabled;
  }

  function fieldNeedsPlaceholder(knob, field) {
    const st = (knob && knob.status) || {};
    const v = st[field];
    return v === "PROPOSED" || v === "STALE" || v === "NOT-IN-SRC";
  }

  function saveSetup(doc, expectedRev) {
    const revErr = checkRev(doc, expectedRev);
    if (revErr) return revErr;
    return ok(doc, [], [], []);
  }


  /** Built-in catalogue preset → behaviour-preset v2 (setup-format §6.4). */
  function builtinPresetFromCatalogue(behaviour, catPreset, catalogueRev) {
    if (!behaviour || !catPreset) return null;
    const answers = {};
    Object.keys(catPreset.overrides || {}).forEach((id) => {
      answers[id] = { value: catPreset.overrides[id] };
    });
    return {
      kind: "behaviour-preset",
      formatVersion: 2,
      id: "builtin:" + behaviour.id + "/" + catPreset.id,
      rev: catalogueRev != null ? catalogueRev : 1,
      name: catPreset.label || catPreset.id,
      behaviourId: behaviour.id,
      catalogue: { rev: catalogueRev != null ? catalogueRev : 1 },
      answers,
      createdAt: null,
      updatedAt: null,
      builtin: {
        deck: catPreset.deck,
        cards: catPreset.cards,
        status: catPreset.status,
        source: catPreset.source,
        notes: catPreset.notes,
      },
    };
  }

  /** active_when evaluation (setup-format §2.6). presentationStyle from ability-presentation.style. */
  function resolveGateValue(when, values, presentationStyle, crossValues) {
    if (!when) return undefined;
    const ref = when.knob || "";
    // Rev 4: {behaviour, knob, eq}; Rev 5+: {knob:"behaviourId.knobId"|local, eq}
    if (when.behaviour) {
      const cv = (crossValues && crossValues[when.behaviour]) || {};
      if (Object.prototype.hasOwnProperty.call(cv, when.knob)) return cv[when.knob];
      // legacy style alias
      if (when.behaviour === "ability-presentation" && (when.knob === "style" || when.knob === "shortcut")) {
        const ap = (crossValues && crossValues["ability-presentation"]) || {};
        return ap.shortcut || ap.style || presentationStyle || "all-menu";
      }
      return undefined;
    }
    if (String(ref).indexOf(".") >= 0) {
      const [bid, kid] = String(ref).split(".");
      const cv = (crossValues && crossValues[bid]) || {};
      if (Object.prototype.hasOwnProperty.call(cv, kid)) return cv[kid];
      // alias style↔shortcut
      if (bid === "ability-presentation") {
        if (kid === "style") return cv.shortcut || cv.style || presentationStyle || "all-menu";
        if (kid === "shortcut") return cv.shortcut || cv.style || presentationStyle || "all-menu";
      }
      if (Object.prototype.hasOwnProperty.call(values, ref)) return values[ref];
      return undefined;
    }
    if (Object.prototype.hasOwnProperty.call(values, ref)) return values[ref];
    // local shortcut may live in cross ability-presentation
    if (ref === "shortcut" || ref === "style") {
      const ap = (crossValues && crossValues["ability-presentation"]) || {};
      return ap.shortcut || ap.style || values.shortcut || values.style || presentationStyle || "all-menu";
    }
    return values[ref];
  }

  function evalWhen(when, values, presentationStyle, crossValues, catalogue) {
    if (!when) return true;
    // Named gate table (catalogue_rev 7)
    if (when.gate) {
      const gates = (catalogue && catalogue.gates) || (global.__catalogueGates) || {};
      const named = gates[when.gate];
      if (!named) return false;
      return evalWhen(named, values, presentationStyle, crossValues, catalogue);
    }
    if (when.any) {
      return when.any.some((w) => evalWhen(w, values, presentationStyle, crossValues, catalogue));
    }
    if (when.all) {
      return when.all.every((w) => evalWhen(w, values, presentationStyle, crossValues, catalogue));
    }
    // list some: { knob, some: { field, eq } }
    if (when.some && when.knob) {
      const listVal = resolveGateValue(when, values, presentationStyle, crossValues);
      if (!Array.isArray(listVal)) return false;
      const field = when.some.field;
      const eq = when.some.eq;
      return listVal.some((item) => item && item[field] === eq);
    }
    if (Object.prototype.hasOwnProperty.call(when, "eq")) {
      return resolveGateValue(when, values, presentationStyle, crossValues) === when.eq;
    }
    return true;
  }

  function isKnobActive(knob, values, presentationStyle, crossValues, catalogue) {
    const when = knob && knob.active_when;
    if (!when) return true;
    return evalWhen(when, values, presentationStyle, crossValues, catalogue);
  }

  function isBehaviourActive(behaviour, presentationStyle, crossValues, catalogue) {
    const when = behaviour && behaviour.active_when;
    if (!when) return true;
    return evalWhen(when, {}, presentationStyle, crossValues, catalogue);
  }

  function activeWhenReason(when) {
    if (!when) return "";
    if (when.behaviour === "ability-presentation" && when.knob === "style") {
      return when.eq === "card-hand"
        ? "Only used with the card hand presentation."
        : "Only used with the unit action menu.";
    }
    if (when.knob && String(when.knob).endsWith("_unlimited") && when.eq === false) {
      return "Turn off Unlimited to set a cap.";
    }
    return "Not active with the current answers.";
  }

  function cataloguePresetToStore(behaviour, catPreset, catalogueRev) {
    return builtinPresetFromCatalogue(behaviour, catPreset, catalogueRev);
  }

  global.SetupStore = {
    createSetup,
    loadSetup,
    viewSetup,
    readiness,
    listMissing,
    listNeedsReask,
    check,
    HARD,
    editAnswer,
    resetAnswer,
    resolveReask,
    undo,
    redo,
    canUndo,
    canRedo,
    duplicate,
    savePreset,
    applyPreset,
    diffPreset,
    updateFromPreset,
    listPresets,
    getPreset,
    describeSetup,
    saveSetup,
    effective,
    disabledByBans,
    fieldNeedsPlaceholder,
    findBehaviour,
    interimStep,
    previousDefault,
    dependencyGates,
    builtinPresetFromCatalogue,
    cataloguePresetToStore,
    isKnobActive,
    isBehaviourActive,
    resolveGateValue,
    evalWhen,
    activeWhenReason,
    answerIsActive,
    PRESET_LIB_KEY,
  };
})(typeof window !== "undefined" ? window : globalThis);
