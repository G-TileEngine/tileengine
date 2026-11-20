import assert from "node:assert/strict";
import { test } from "node:test";
import { knobWidget } from "../../tools/maker/widgets.ts";
test("knob widgets", () => {
  const slider = knobWidget({ id: "unit_hp", label: "Health", type: "slider", min: 1, max: 21, step: 1 }, 9);
  assert.match(slider, /Health/); assert.match(slider, /type="range"/); assert.match(slider, /min="1"/); assert.match(slider, /max="21"/); assert.match(slider, /value="9"/);
  const pick = knobWidget({ id: "p", label: "Pick", type: "picker", options: ["a", { value: "b", label: "Bee" }] }, "b");
  assert.match(pick, /Bee/); assert.match(pick, />a</); assert.match(pick, /aria-pressed="true"/);
  assert.match(knobWidget({ id: "t", label: "On", type: "toggle" }, true), /aria-pressed="true"/);
  assert.match(knobWidget({ id: "r", label: "Ref", type: "ref", builtin: ["basic", "spells"] }, "basic"), /basic/);
  assert.match(knobWidget({ id: "r2", label: "Ref", type: "ref" }, "none"), /value="none"/);
  assert.match(knobWidget({ id: "l", label: "List", type: "list" }, [{ id: "g", label: "Group" }]), /Group/);
  const text = knobWidget({ id: "x", label: "Line", type: "text", max_len: 140 }, "Hi");
  assert.match(text, /data-max="140"/); assert.match(text, /value="Hi"/);
  const colour = knobWidget({ id: "c", label: "Team colour", type: "colour" }, "--accent");
  assert.equal(/#[0-9a-fA-F]{3,8}\b|\brgb|\bhsl/.test(colour), false); assert.match(colour, /var\(--accent\)/);
  assert.equal(knobWidget({ id: "z", label: "Odd", type: "matrix" }, 1).includes("Not editable here"), true);
});
