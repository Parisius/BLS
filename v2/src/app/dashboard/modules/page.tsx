import Link from "next/link";
import { MODULES } from "@/config/modules";
import { getDictionary } from "@/lib/i18n/locale";

export default async function ModulesPage() {
  const { t } = await getDictionary();

  return (
    <div className="flex flex-col gap-10">
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {t.modules.title}
      </h1>
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-5 md:px-10 lg:px-20 xl:px-32">
        {MODULES.map(({ slug, href, nameKey, Icon }) => (
          <Link
            href={href}
            key={slug}
            className="flex w-40 flex-col items-center gap-2"
          >
            <div className="group flex h-32 w-32 items-center justify-center rounded-full bg-primary p-5 text-primary-foreground shadow-lg">
              <Icon className="size-12 transition duration-500 group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <span className="text-center font-semibold uppercase">
              {t.modules[nameKey]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
