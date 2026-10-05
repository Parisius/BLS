import "server-only";
import { headers } from "next/headers";

/**
 * The tenant this deployment serves, sent to the backend as `X-Tenant` (and as `tenant` at login).
 *
 *  1. `TENANT_SLUG` when set: one deployment, one tenant (also the local-development setting).
 *  2. Otherwise the first label of the host the visitor used (`acme.bls.app` -> `acme`).
 *
 * `undefined` lets the backend fall back to its own host-based resolution. A user can never choose the tenant
 * from inside the app: it is fixed by the deployment.
 */
export async function getTenantSlug(): Promise<string | undefined> {
  const configured = process.env.TENANT_SLUG?.trim();
  if (configured) return configured;

  try {
    const host = ((await headers()).get("x-forwarded-host") ?? (await headers()).get("host") ?? "")
      .split(":")[0]
      .toLowerCase();
    const labels = host.split(".");
    if (labels.length >= 3 && labels[0] !== "www" && !/^\d+$/.test(labels[0])) return labels[0];
  } catch {
    // Outside a request (e.g. at build time) there is no host to read.
  }
  return undefined;
}
