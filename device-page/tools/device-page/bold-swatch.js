const ash = {
  fire: ["#3a0f1e", "#7c1a16", "#c4400f", "#ee7c1a", "#ffc53d", "#fff6d2"],
  frost: ["#0c1c3e", "#173a78", "#2270b2", "#44b4e2", "#9ee4f6", "#ecfbff"],
  holy: ["#2e2250", "#6a4880", "#c88a2c", "#ecc650", "#faeab2", "#fffdf3"],
  venom: ["#26163c", "#22502e", "#3c8424", "#78bc20", "#bee63a", "#effa9c"],
}, moon = {
  fire: ["#200a24", "#5c1428", "#a8301c", "#e2661e", "#ffb440", "#ffefc4"],
  frost: ["#06122e", "#0e2a62", "#1c56a6", "#2e96d4", "#78d6f2", "#dcf6ff"],
  holy: ["#1c1838", "#4a3670", "#ae8030", "#dcba52", "#f2e4a8", "#fffaea"],
  venom: ["#160c28", "#183c24", "#2a6428", "#4c9a24", "#94d43a", "#daf28a"],
};
export const SWATCH = { status: "approved 2026-11-16, style ids btf-ashroad@3 / btf-moonlit@4 (pending engine data)", styles: { "btf-ashroad@3": ash, "btf-moonlit@4": moon } };
const KEYS = ["fire", "frost", "holy", "venom"]         ;
export const panelRows = ()                                                                                                       => (["btf-ashroad@3", "btf-moonlit@4"]         ).flatMap((style) => KEYS.map((key) => ({ style, key, stops: SWATCH.styles[style][key] })));
