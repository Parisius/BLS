"use client";

import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllPermissions } from "@/lib/administration/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

/** Dictionary names of the modules the backend's permissions are grouped under. */
const MODULE_LABEL: Record<string, "contracts" | "litigation" | "safety" | "recovery" | "accountIncidents" | "governance" | "audit" | "evaluation" | "legalMonitoring" | "textBank"> = {
  contract: "contracts",
  litigation: "litigation",
  guarantee: "safety",
  recovery: "recovery",
  incident: "accountIncidents",
  governance: "governance",
  audit: "audit",
  evaluation: "evaluation",
  legal_watch: "legalMonitoring",
  document: "textBank",
};

const humanize = (value: string) => value.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

/**
 * Permissions grouped by module with a "select all" per group. The backend still returns the old
 * single-word codes next to the `module.action` ones; only the latter carry a module and are offered.
 */
export function PermissionPicker({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  const { t } = useDictionary();
  const { data, isLoading, isError } = useAllPermissions();

  const groups = useMemo(() => {
    const byModule = new Map<string, NonNullable<typeof data>>();
    for (const permission of data ?? []) {
      if (!permission.module || !permission.id) continue;
      byModule.set(permission.module, [...(byModule.get(permission.module) ?? []), permission]);
    }
    return [...byModule.entries()];
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid gap-3 rounded-lg border p-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    );
  }
  if (isError) return <p className="text-sm text-destructive">{t.common.loadError}</p>;

  return (
    <div className="grid max-h-80 gap-5 overflow-y-auto rounded-lg border p-3">
      {groups.map(([module, permissions]) => {
        const ids = permissions.map((permission) => permission.id!);
        const selected = ids.filter((id) => value.includes(id));
        const allSelected = selected.length === ids.length;
        const moduleName = MODULE_LABEL[module]
          ? t.modules[MODULE_LABEL[module]]
          : module === "user"
            ? t.administrationModules.users
            : module === "role"
              ? t.administrationModules.roles
              : module === "subsidiary"
                ? t.administrationModules.subsidiaries
                : module === "data"
                  ? t.adminActions.dataScope
                  : humanize(module);

        return (
          <div key={module} className="grid gap-2">
            <div className="flex items-center gap-2 border-b pb-1.5">
              <Checkbox
                id={`module-${module}`}
                checked={allSelected}
                indeterminate={selected.length > 0 && !allSelected}
                onCheckedChange={(checked) =>
                  onChange(checked ? [...new Set([...value, ...ids])] : value.filter((id) => !ids.includes(id)))
                }
              />
              <Label htmlFor={`module-${module}`} className="font-semibold">
                {moduleName}
              </Label>
              <span className="text-xs text-muted-foreground">
                {selected.length}/{ids.length}
              </span>
            </div>
            <div className="grid gap-2 pl-6 sm:grid-cols-2">
              {permissions.map((permission) => {
                const id = permission.id!;
                return (
                  <div key={id} className="flex items-start gap-2">
                    <Checkbox
                      id={`permission-${id}`}
                      checked={value.includes(id)}
                      onCheckedChange={(checked) =>
                        onChange(checked ? [...value, id] : value.filter((item) => item !== id))
                      }
                    />
                    <Label htmlFor={`permission-${id}`} className="flex flex-col gap-0.5 font-normal">
                      {humanize(permission.action ?? permission.name ?? "")}
                      <span className="font-mono text-[11px] text-muted-foreground">{permission.name}</span>
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
