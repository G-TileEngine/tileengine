import type { Sq } from "../types/core-types.ts";

/** A warning, never an exception (BUILD_GUIDE §2 law 10). `code` is stable; `message` is for people. */
export type Notice = { readonly code: string; readonly message: string; readonly at?: Sq };
