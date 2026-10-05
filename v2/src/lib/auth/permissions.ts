/**
 * Permissions come from `GET /current-user` as plain `module.action` strings (e.g. `contract.update`). The backend is
 * the authority: these helpers only decide what the UI offers, so a missing permission is never a security measure.
 */

/** The permission that lets a user open each module (and the admin screens). */
export const MODULE_READ = {
  governance: "governance.read",
  contracts: "contract.read",
  safety: "guarantee.read",
  "account-incidents": "incident.read",
  litigation: "litigation.read",
  recovery: "recovery.read",
  audit: "audit.read",
  evaluation: "evaluation.read",
  "legal-monitoring": "legal_watch.read",
  "text-bank": "document.read",
} as const;

export const ADMIN_READ = {
  users: "user.read",
  roles: "role.read",
  subsidiaries: "subsidiary.read",
} as const;

export type PermissionChecker = {
  can: (permission: string) => boolean;
  canAny: (...permissions: string[]) => boolean;
};

export function makePermissionChecker(permissions: readonly string[] | undefined): PermissionChecker {
  const granted = new Set(permissions ?? []);
  return {
    can: (permission) => granted.has(permission),
    canAny: (...list) => list.some((permission) => granted.has(permission)),
  };
}

/**
 * A tenant can switch modules off. An empty list means "nothing restricted" (the default tenant ships with `[]`),
 * and entries are matched against both the module slug and its permission prefix.
 */
export function isModuleEnabled(enabled: readonly string[] | undefined, slug: string, permission?: string) {
  if (!enabled || enabled.length === 0) return true;
  const prefix = permission?.split(".")[0];
  return enabled.includes(slug) || (!!prefix && enabled.includes(prefix));
}
