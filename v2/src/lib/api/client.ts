import "server-only";
import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./schema";
import { auth } from "@/auth";

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
    return request;
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
function errorMessage(error: unknown): string | undefined {
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
