import { ApiFailure } from "./result";

/**
 * The text to show for a failed action: the backend's own message for the cases it explains on purpose
 * (409 conflicts, 422 validation), a "not allowed" note for 403, and `fallback` for anything else.
 */
export function failureMessage(error: unknown, fallback: string, forbidden: string) {
  if (error instanceof ApiFailure) {
    if (error.status === 403) return forbidden;
    if (error.status === 409 || error.status === 422) return error.message || fallback;
  }
  return fallback;
}
