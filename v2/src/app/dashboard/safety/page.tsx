import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SAFETY_MODULES } from "@/config/modules";
import { getDictionary } from "@/lib/i18n/locale";

export default async function SafetyPage() {
  const { t } = await getDictionary();

  return (
    <div className="flex h-full flex-col gap-10">
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {t.safetyModules.title}
      </h1>
      <div className="grid auto-rows-fr gap-10 sm:grid-cols-2 md:grid-cols-3">
        {SAFETY_MODULES.map(({ slug, href, nameKey, Icon }) => (
          <Link href={href} key={slug}>
            <Card className="h-full bg-primary text-primary-foreground">
              <CardHeader className="h-full flex-row items-center justify-center gap-2">
                <Icon size={50} />
                <CardTitle className="text-center tracking-normal">
                  {t.safetyModules[nameKey]}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
