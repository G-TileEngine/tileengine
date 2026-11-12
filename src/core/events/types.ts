import type { CoreEventMap, EventUnion, ModeEventMap } from "../../types/core-types.ts";

/** Core events = DSK's CoreEventMap (landedOn, pushBlocked, enteredLane, actionLogged; MAY-MOVE). Step 07 adds none of its own. */
export type EngineEventMap = CoreEventMap;
export type EngineEvent = EventUnion<EngineEventMap>;
export const ENGINE_EVENT_TYPES = ["landedOn", "pushBlocked", "enteredLane", "actionLogged"] as const satisfies readonly (keyof EngineEventMap)[];

/** A mode's own events (MODES-v2): type name → payload. Registered at bus creation; never core names.
 *  Default = DSK's augmentable ModeEventMap (only the optional-never placeholder "mode.none" in core; EventUnion drops it). */
export type EventMap<M> = { readonly [K in keyof M]?: object };
export type ModeEventType<M> = EventUnion<M>["type"];
export type NoModeEvents = ModeEventMap;
export type BusEvent<M extends EventMap<M>> = EngineEvent | EventUnion<M>;
export type EventRegistry<M extends EventMap<M>> = { readonly mode: string; readonly types: readonly ModeEventType<M>[] };

export type BusRecord<M extends EventMap<M> = NoModeEvents> = { readonly seq: number; readonly tick: number; readonly event: BusEvent<M> };

/** Rolling bus history size (step 17): the newest `history` records are kept; 0 keeps none. The match log is never capped. */
export type BusLimits = { readonly history: number };

export interface EventBus<M extends EventMap<M> = NoModeEvents> {
  emit(event: BusEvent<M>): void;
  on<K extends BusEvent<M>["type"]>(type: K, fn: (event: Extract<BusEvent<M>, { readonly type: K }>, rec: BusRecord<M>) => void): () => void;
  onAny(fn: (rec: BusRecord<M>) => void): () => void;
  onError(fn: (err: unknown) => void): () => void;
  isRegistered(type: string): boolean;
  history(): readonly BusRecord<M>[];
  /** Step 17: drops every listener and the history; later emits record and call nothing, later subscriptions store nothing. Safe to call twice. */
  dispose(): void;
}
