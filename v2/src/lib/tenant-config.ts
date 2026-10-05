import "server-only";
import { cache } from "react";
import { apiClient } from "@/lib/api/client";
import { getTenantSlug } from "@/lib/tenant";

/** The public look-and-feel settings of the active tenant (`GET /tenant-config`). */
export interface TenantConfig {
  name: string;
  slug: string;
  logoUrl: string | null;
  locale: string | null;
  currency: string | null;
  enabledModules: string[];
  isActive: boolean;
}

const TTL_MS = 60_000;
const memo = new Map<string, { at: number; config: TenantConfig | null }>();

async function fetchTenantConfig(slug: string): Promise<TenantConfig | null> {
  try {
    const { data } = await apiClient.GET("/tenant-config");
    const raw = data?.data;
    if (!raw) return null;
    return {
      name: raw.name ?? slug,
      slug: raw.slug ?? slug,
      logoUrl: raw.logo_url ?? null,
      locale: raw.locale ?? null,
      currency: raw.currency ?? null,
      enabledModules: raw.enabled_modules ?? [],
      isActive: raw.is_active ?? true,
    };
  } catch {
    return null;
  }
}

/**
 * Branding and defaults are cosmetic, so a backend hiccup must never take the app down: failures resolve to `null`
 * and callers fall back to the built-in look. Cached for a minute per tenant so navigation doesn't re-fetch it.
 */
export const getTenantConfig = cache(async (): Promise<TenantConfig | null> => {
  const slug = (await getTenantSlug()) ?? "";
  const hit = memo.get(slug);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.config;
  const config = await fetchTenantConfig(slug);
  if (config) memo.set(slug, { at: Date.now(), config });
  return config;
});
