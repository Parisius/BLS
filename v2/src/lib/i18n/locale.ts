import "server-only";
import { cookies } from "next/headers";
import { getTenantConfig } from "@/lib/tenant-config";
import { DEFAULT_LOCALE, dictionaries, LOCALES, type Locale } from "./dictionary";

export const LOCALE_COOKIE = "locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  if (LOCALES.includes(value as Locale)) return value as Locale;
  // No personal choice yet: follow the tenant's default language.
  const tenantLocale = (await getTenantConfig())?.locale?.slice(0, 2);
  return LOCALES.includes(tenantLocale as Locale) ? (tenantLocale as Locale) : DEFAULT_LOCALE;
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
