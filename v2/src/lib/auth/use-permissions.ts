"use client";

import { useMemo } from "react";
import { useCurrentUser } from "@/lib/administration/hooks";
import { makePermissionChecker } from "./permissions";

/** What the signed-in user may do. While the user is still loading nothing is granted, so actions never flash in. */
export function usePermissions() {
  const { data, isLoading } = useCurrentUser();
  return useMemo(
    () => ({
      ...makePermissionChecker(data?.permissions),
      isLoading,
      canSeeAllSubsidiaries: !!data?.can_see_all_subsidiaries,
    }),
    [data, isLoading],
  );
}
