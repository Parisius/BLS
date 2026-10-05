"use client";

import { usePermissions } from "@/lib/auth/use-permissions";

/** Renders its children only when the user has the permission (or any of `anyOf`). */
export function Can({
  permission,
  anyOf,
  fallback = null,
  children,
}: {
  permission?: string;
  anyOf?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { can, canAny } = usePermissions();
  const allowed = permission ? can(permission) : canAny(...(anyOf ?? []));
  return allowed ? <>{children}</> : <>{fallback}</>;
}
