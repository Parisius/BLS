/** The three kinds of things the bank holds, in URL form. */
export const BANK_KINDS = ["texts", "links", "other-documents"] as const;
export type BankKind = (typeof BANK_KINDS)[number];

export const isBankKind = (value: string): value is BankKind => (BANK_KINDS as readonly string[]).includes(value);

/** Backend `type` of each kind. */
export const KIND_TYPE: Record<BankKind, "file" | "link" | "other"> = {
  texts: "file",
  links: "link",
  "other-documents": "other",
};

/** Key of each kind in the dictionary. */
export const KIND_KEY = { texts: "texts", links: "links", "other-documents": "otherDocuments" } as const;
