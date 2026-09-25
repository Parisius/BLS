/**
 * The three safeties (real-estate/mortgage, movable, personal) are one backend
 * resource (`/guarantees`) told apart by the `security` filter, so the whole
 * module is parameterized by kind. `slug` is the route segment.
 */
export type SafetyKind = "mortgage" | "movable-safety" | "personal-safety";

export const SAFETY_KINDS = ["mortgage", "movable-safety", "personal-safety"] as const;

export const KIND_SECURITY: Record<SafetyKind, "property" | "movable" | "personal"> = {
  mortgage: "property",
  "movable-safety": "movable",
  "personal-safety": "personal",
};

/** Dictionary key for the kind's texts. */
export const KIND_KEY = {
  mortgage: "mortgage",
  "movable-safety": "movableSafety",
  "personal-safety": "personalSafety",
} as const;

export const MOVABLE_SECURITIES = ["pledge", "collateral"] as const;
export const MOVABLE_TYPES: Record<(typeof MOVABLE_SECURITIES)[number], readonly string[]> = {
  pledge: ["stock", "vehicle"],
  collateral: ["shareholder_rights", "trade_fund", "bank_account"],
};
export const FORMALIZATION_TYPES = ["legal", "conventional"] as const;
export const PERSONAL_TYPES = ["bonding", "autonomous", "autonomous_counter"] as const;

export const isSafetyKind = (value: string): value is SafetyKind =>
  (SAFETY_KINDS as readonly string[]).includes(value);
