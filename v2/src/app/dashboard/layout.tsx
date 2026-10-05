import Image from "next/image";
import Link from "next/link";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NotificationsBell } from "@/components/alert/notifications-bell";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { LocaleSelect } from "@/components/locale-select";
import { ADMIN_READ, makePermissionChecker } from "@/lib/auth/permissions";
import { getSessionUser } from "@/lib/auth/server";
import { getTenantConfig } from "@/lib/tenant-config";
import { getDictionary } from "@/lib/i18n/locale";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const { locale, t } = await getDictionary();
  const user = await getSessionUser();
  const tenant = await getTenantConfig();
  const logo = tenant?.logoUrl ?? "/global/images/full-logo-color.webp";
  const showAdministration = !user || makePermissionChecker(user.permissions).canAny(...Object.values(ADMIN_READ));

  return (
    <main className="container flex flex-col gap-10 py-5">
      <header className="flex items-center justify-between gap-2">
        <Link href="/dashboard/modules">
          <Image
            src={logo}
            alt={tenant?.name ?? "BLS's logo"}
            width={200}
            height={67}
            unoptimized={!!tenant?.logoUrl}
            className="hidden h-auto max-h-16 w-auto object-contain md:block"
          />
          <Image
            src={logo}
            alt={tenant?.name ?? "BLS's logo"}
            width={100}
            height={33}
            unoptimized={!!tenant?.logoUrl}
            className="h-auto max-h-9 w-auto object-contain md:hidden"
          />
        </Link>

        <div className="flex items-center">
          <NotificationsBell />

          {showAdministration && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    nativeButton={false}
                    render={<Link href="/dashboard/administration" />}
                  />
                }
              >
                <UserCog />
              </TooltipTrigger>
              <TooltipContent>{t.dashboard.administration}</TooltipContent>
            </Tooltip>
          )}

          <LocaleSelect locale={locale} />

          <LogoutButton label={t.dashboard.logout} />
        </div>
      </header>

      {children}

      <div className="fixed inset-x-0 bottom-0 bg-background text-center text-xs italic text-muted-foreground">
        &copy; {new Date().getFullYear()} {t.common.copyright}
      </div>
    </main>
  );
}
