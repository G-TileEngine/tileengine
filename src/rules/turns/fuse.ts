import type { Clock, SimTimer } from "../../core/clock/index.ts";
import type { Event } from "../../state/types.ts";

/** Turn fuse length in integer sim ms (CN-001), > 0. Any value is legal (user-adjustable, CEO);
 *  30000 and 60000 are suggestions only. The BTF preset's 60000 default is preset/project data, never core. */
export type FuseMs = number;
export type FuseSetting = "off" | FuseMs;

export function startFuse(clock: Clock, setting: FuseSetting, emit: (e: Event) => void): SimTimer | null {
  if (setting === "off") return null;
  if (!Number.isInteger(setting) || setting <= 0) throw new RangeError(`invalidValue: ${setting}`);
  return clock.after(setting, () => emit({ type: "FUSE_EXPIRE" }));
}
