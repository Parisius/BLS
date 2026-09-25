export const PARTY_CATEGORIES = ["plaintiff", "defendant", "intervenant", "forced_intervenant"] as const;
export type PartyCategory = (typeof PARTY_CATEGORIES)[number];

/** How a party relates to the bank in a case. */
export const PARTY_TYPES = ["client", "employee", "provider", "partner"] as const;
export type PartyType = (typeof PARTY_TYPES)[number];

/** Whether a party record is a natural person or a company. */
export const PARTY_ENTITY_TYPES = ["individual", "legal"] as const;
export type PartyEntityType = (typeof PARTY_ENTITY_TYPES)[number];
