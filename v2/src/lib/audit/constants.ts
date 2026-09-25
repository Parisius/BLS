/** Modules that can be audited (backend `module` values). */
export const AUDIT_MODULES = [
  "contracts",
  "litigation",
  "guarantees_security_personal",
  "guarantees_security_movable",
  "conventionnal_hypothec",
  "incidents",
  "recovery",
  "general_meeting",
  "session_administrators",
  "management_committees",
] as const;
export type AuditModule = (typeof AUDIT_MODULES)[number];
