import "server-only";
import { redirect } from "next/navigation";
import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./schema";
import { auth } from "@/auth";
import { getTenantSlug } from "@/lib/tenant";
import type { ActionResult } from "./result";

/**
 * Every route this client can call, its methods, params, request bodies and
 * response shapes, comes from `schema.d.ts` — generated from `openapi.json`
 * (itself reverse-engineered from the original app's `services/api-sdk`).
 * Regenerate with `pnpm gen:api` whenever the backend contract changes.
 */
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const session = await auth();
    if (session?.accessToken) {
      request.headers.set("Authorization", `Bearer ${session.accessToken}`);
    }
    // Every tenant route needs its tenant; the slug comes from the deployment, never from user input.
    const tenant = await getTenantSlug();
    if (tenant) request.headers.set("X-Tenant", tenant);
    request.headers.set("Accept", "application/json");
    return request;
  },
  onResponse({ request, response }) {
    // A 401 on a call that carried a token means the session is dead: sign out instead of leaving every screen failing.
    if (response.status === 401 && request.headers.has("Authorization")) redirect("/session-expired");
  },
};

export const apiClient = createClient<paths>({
  baseUrl: process.env.API_URL,
});

apiClient.use(authMiddleware);

/**
 * Unwraps this API's `{ data: T }` envelope and throws a plain `Error` on
 * any non-2xx response, so callers can just `await` a resource instead of
 * checking `error`/`data` on every call.
 */
export function errorMessage(error: unknown): string | undefined {
  return typeof error === "string" ? error : (error as { message?: string } | undefined)?.message;
}

/** For calls that return no useful body: throws with the backend's real message, or `fallback`. */
export function throwIfError(error: unknown, fallback: string) {
  if (error) throw new Error(errorMessage(error) ?? fallback);
}

export function unwrap<T>({
  data,
  error,
}: {
  data?: { data?: T };
  error?: unknown;
}): T {
  if (error || data?.data === undefined) {
    throw new Error(errorMessage(error) ?? "Request to the API failed");
  }
  return data.data;
}

/** Turns an openapi-fetch response into a serialisable result carrying the backend's status, message and field errors. */
export function toResult<T = void>(
  { data, error, response }: { data?: { data?: unknown }; error?: unknown; response: Response },
  fallback: string,
): ActionResult<T> {
  if (error || !response.ok) {
    const body = (typeof error === "object" && error ? error : {}) as { errors?: Record<string, string[]> };
    return { ok: false, status: response.status, message: errorMessage(error) ?? fallback, errors: body.errors };
  }
  return { ok: true, data: (data?.data ?? undefined) as T };
}
