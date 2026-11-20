/** Knob ids `playDocsOf` reads. Ids only, no rules. */
export const WIRED: Readonly<Record<string, readonly string[]>> = {
  "unit-roster": ["unit_hp", "unit_atk"],
  "basic-attack": ["reach_mode", "custom_ns", "custom_ew"],
  "line-shot": ["range", "damage"],
  talk: ["line"],
};
