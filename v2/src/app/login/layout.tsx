import Image from "next/image";
import { getDictionary } from "@/lib/i18n/locale";
import { LocaleSelect } from "@/components/locale-select";

export default async function LoginLayout({ children }: LayoutProps<"/login">) {
  const { locale, t } = await getDictionary();

  return (
    <main className="grid h-full grid-cols-2">
      <div className="container hidden flex-col items-center justify-center gap-5 bg-primary md:flex">
        <Image
          src="/global/images/full-logo.webp"
          alt="BLS's logo"
          width={300}
          height={99}
        />
        <p className="w-2/3 text-center text-xl text-primary-foreground">
          {t.auth.welcome}
        </p>
      </div>

      <div className="relative col-span-2 flex flex-col md:col-span-1">
        <div className="flex items-center justify-between p-5 md:justify-end">
          <Image
            src="/global/images/full-logo-color.webp"
            alt="BLS's logo"
            width={100}
            height={33}
            className="md:hidden"
          />
          <div className="flex items-center gap-2">
            <LocaleSelect locale={locale} />
            <Image
              src="/global/images/afrikskills-logo.webp"
              alt="AfrikSkills's logo"
              width={100}
              height={31}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          {children}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 text-center text-xs italic text-muted-foreground md:left-1/2">
        &copy; {new Date().getFullYear()} {t.common.copyright}
      </div>
    </main>
  );
}
