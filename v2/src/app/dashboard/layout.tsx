import Image from "next/image";
import Link from "next/link";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { LocaleSelect } from "@/components/locale-select";
import { getDictionary } from "@/lib/i18n/locale";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const { locale, t } = await getDictionary();

  return (
    <main className="container flex flex-col gap-10 py-5">
      <header className="flex items-center justify-between gap-2">
        <Link href="/dashboard/modules">
          <Image
            src="/global/images/full-logo-color.webp"
            alt="BLS's logo"
            width={200}
            height={67}
            className="hidden md:block"
          />
          <Image
            src="/global/images/full-logo-color.webp"
            alt="BLS's logo"
            width={100}
            height={33}
            className="md:hidden"
          />
        </Link>

        <div className="flex items-center">
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
