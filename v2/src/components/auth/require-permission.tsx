import { ShieldAlert } from "lucide-react";
import { getPermissionChecker } from "@/lib/auth/server";
import { getDictionary } from "@/lib/i18n/locale";

/**
 * Guards a whole page tree. If the permissions can't be read at all, the page is shown anyway: this is only
 * a convenience, and every API call is checked by the backend regardless.
 */
export async function RequirePermission({
  permission,
  anyOf,
  children,
}: {
  permission?: string;
  anyOf?: string[];
  children: React.ReactNode;
}) {
  const checker = await getPermissionChecker();
  const allowed = !checker.known || (permission ? checker.can(permission) : checker.canAny(...(anyOf ?? [])));
  if (allowed) return <>{children}</>;

  const { t } = await getDictionary();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
      <ShieldAlert className="size-16 text-muted-foreground" />
      <h1 className="text-2xl font-bold">{t.permissions.noAccessTitle}</h1>
      <p className="max-w-md text-muted-foreground">{t.permissions.noAccessMessage}</p>
    </div>
  );
}
