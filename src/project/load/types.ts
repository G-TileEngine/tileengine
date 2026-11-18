/** S1 load contract. Store documents are the migrated JSON (unknown keys kept). */
export type ProjectFiles = Readonly<Record<string, unknown>>;
export type Severity = "hard" | "warning" | "info";
export type ReportRow = { readonly code: string; readonly severity: Severity; readonly path: string; readonly detail?: string };
export type Doc = Readonly<Record<string, unknown>>;
export type ProjectManifest = Doc;
export type CatalogueSlice = Doc;
export type GameMap = Doc;
export type Stage = Doc;
export type Unit = Doc;
export type BehaviourSetup = Doc;
export type ProjectStore = {
  readonly manifest: ProjectManifest; readonly slice: CatalogueSlice;
  readonly maps: Readonly<Record<string, GameMap>>; readonly stages: Readonly<Record<string, Stage>>;
  readonly units: Readonly<Record<string, Unit>>; readonly setups: Readonly<Record<string, BehaviourSetup>>;
  readonly unknownFiles: Readonly<Record<string, unknown>>;
};
export type ProjectLoad =
  | { readonly ok: true; readonly readOnly: false; readonly project: ProjectStore; readonly report: readonly ReportRow[] }
  | { readonly ok: false; readonly readOnly: false; readonly project: ProjectStore; readonly report: readonly ReportRow[] }
  | { readonly ok: false; readonly readOnly: true; readonly project: null; readonly report: readonly ReportRow[] };

const SLOTS: Readonly<Record<string, string>> = { maps: "map", stages: "stage", units: "unit", setups: "behaviour-setup" };
/** Known document path, or null when the file is kept as an unknown. */
export function knownKind(path: string): string | null {
  if (path === "project.json") return "tile-project";
  if (path === "catalogue/slice.json") return "catalogue-slice";
  const m = /^(maps|stages|units|setups)\/[^/]+\.json$/.exec(path);
  return m === null ? null : SLOTS[m[1] ?? ""] ?? null;
}
