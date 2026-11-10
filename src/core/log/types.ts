import type { ActionKind, LogSeq } from "../../types/core-types.ts";
import type { Aim } from "../targeting/types.ts";

/** M4: an action is data with a duration. The log stores it; core never executes it.
 *  `target: null` = no target: no pipe; the resolve context gets the caster (actor) only. */
export type ActionTarget = Aim | null;
export type Action = {
  readonly id: string;
  readonly kind: ActionKind;
  readonly actor: string;
  readonly target: ActionTarget;
  readonly durationMs: number | null;
  readonly turns: number | null;
  readonly effects: readonly string[];
  readonly via?: { readonly presentation: string; readonly ref?: string };
};

export const LOG_FORMAT_VERSION = 1;
export type LogHeader = {
  readonly seed: number;
  readonly formatVersion: typeof LOG_FORMAT_VERSION;
  readonly engineVersion: string;
  readonly projectHash: string;
};
/** seq = DSK LogSeq: 1-based append position. A save's logSeq is the last applied seq; 0 = none applied. */
export type LogEntry = { readonly seq: LogSeq; readonly tick: number; readonly action: Action };

export interface CommandLog {
  readonly header: LogHeader;
  append(tick: number, action: Action): void;
  entries(): readonly LogEntry[];
  /** LogSeq of the last entry; 0 when the log is empty (the save convention). */
  lastSeq(): LogSeq;
  toJSON(): string;
}
export type ParseResult = { readonly ok: true; readonly log: CommandLog } | { readonly ok: false; readonly error: string };
