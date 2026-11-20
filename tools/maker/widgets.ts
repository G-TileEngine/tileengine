const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export type KnobOpt = string | { readonly value: string; readonly label: string };
export type KnobSpec = { readonly id: string; readonly label: string; readonly type: string; readonly min?: number | null; readonly max?: number | null; readonly step?: number | null; readonly max_len?: number | null; readonly options?: readonly KnobOpt[] | null; readonly builtin?: readonly string[] | null };
const PALETTE = ["--accent", "--ink", "--danger", "--ok", "--warn"] as const;
const optOf = (item: KnobOpt): { readonly value: string; readonly label: string } => (typeof item === "string" ? { value: item, label: item } : item);
const num = (v: number | null | undefined): string => (typeof v === "number" ? String(v) : "");
export function knobWidget(spec: KnobSpec, value: unknown): string {
  const id = esc(spec.id), label = esc(spec.label);
  if (spec.type === "slider") {
    const cur = typeof value === "number" ? String(value) : num(spec.min);
    return `<label class="sub" for="k-${id}">${label}</label><input id="k-${id}" class="knob" type="range" min="${esc(num(spec.min))}" max="${esc(num(spec.max))}" step="${esc(num(spec.step) || "1")}" value="${esc(cur)}" data-knob="${id}" aria-label="${label}"><span class="sub" data-val="${id}">${esc(cur)}</span>`;
  }
  if (spec.type === "picker") return `<p class="sub">${label}</p>${(spec.options ?? []).map(optOf).map((o) => `<button type="button" class="btn" data-act="k:pick:${id}:${esc(o.value)}" aria-pressed="${value === o.value ? "true" : "false"}">${esc(o.label)}</button>`).join("")}`;
  if (spec.type === "toggle") return `<button type="button" class="btn" data-act="k:toggle:${id}" aria-pressed="${value === true ? "true" : "false"}" aria-label="${label}">${label}</button>`;
  if (spec.type === "ref") {
    const builtins = spec.builtin ?? [];
    return builtins.length === 0 ? `<label class="sub" for="k-${id}">${label}</label><input id="k-${id}" class="name-field" data-knob="${id}" aria-label="${label}" value="${esc(typeof value === "string" ? value : "")}">` : `<p class="sub">${label}</p>${builtins.map((o) => `<button type="button" class="btn" data-act="k:pick:${id}:${esc(o)}" aria-pressed="${value === o ? "true" : "false"}">${esc(o)}</button>`).join("")}`;
  }
  if (spec.type === "list") {
    const items = Array.isArray(value) ? value.flatMap((item) => (typeof item === "object" && item !== null && "label" in item && typeof item.label === "string" ? [item.label] : [])) : [];
    return `<p class="sub">${label}</p>${items.map((item) => `<p class="sub">${esc(item)}</p>`).join("")}<input class="name-field" data-knob="${id}" aria-label="${label}" value="">`;
  }
  if (spec.type === "text") return `<label class="sub" for="k-${id}">${label}</label><input id="k-${id}" class="name-field" data-knob="${id}"${typeof spec.max_len === "number" ? ` data-max="${spec.max_len}"` : ""} aria-label="${label}" value="${esc(typeof value === "string" ? value : "")}">`;
  if (spec.type === "colour") return `<p class="sub">${label}</p>${PALETTE.map((token) => `<button type="button" class="btn" data-act="k:colour:${id}:${token}" aria-label="${label} ${token}" aria-pressed="${value === token ? "true" : "false"}" style="background:var(${token});color:var(--ink)">${esc(token)}</button>`).join("")}`;
  return `<p class="sub">${label}</p><p>Not editable here</p>`;
}
