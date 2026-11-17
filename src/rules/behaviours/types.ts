import type { Notice } from "../../core/notice.ts";

export type KnobType = "slider" | "toggle" | "picker" | "list";
export type Gate = { readonly knob: string; readonly eq: unknown } | { readonly gate: string };
export type KnobSpec = { readonly id: string; readonly type: KnobType; readonly default: unknown; readonly min?: number; readonly max?: number; readonly step?: number; readonly options?: readonly unknown[]; readonly perUnit?: true; readonly nullable?: true; readonly l5?: "hp"; readonly when?: Gate; readonly item?: Readonly<Record<string, boolean>>; readonly reserved?: true };
export type Layer = "L0" | "L1" | "L2" | "L3" | "L4";
export type Resolved = { readonly value: unknown; readonly layer: Layer };
export type SetupLayers = { readonly answers?: unknown; readonly stage?: unknown; readonly unit?: unknown; readonly stageUnit?: unknown };
export type SetupIn = SetupLayers & { readonly behaviourId: string };
export type InstallCtx = { readonly gates?: Readonly<Record<string, boolean>>; readonly difficulty?: { readonly hp: number } };
export type KnobUnsupported = { readonly code: "knobUnsupported"; readonly behaviour: string; readonly knob: string; readonly value: unknown; readonly layer: Layer | null; readonly why: "noCode" | "value" | "noBehaviour"; readonly detail?: string };
export type KnobReader = { get(knob: string): unknown; unsupported(knob: string, detail?: string): void };
export type BehaviourDef<T = unknown> = { readonly id: string; readonly knobs: readonly KnobSpec[]; readonly install: (k: KnobReader) => T };
export type Installed<T = unknown> = { readonly id: string; readonly out: T | null; readonly knobs: Readonly<Record<string, Resolved>>; readonly unsupported: readonly KnobUnsupported[]; readonly notes: readonly Notice[]; readonly playable: boolean };
export type Registry = { readonly ids: readonly string[]; get(id: string): BehaviourDef | undefined };
