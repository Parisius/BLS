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

/**
 * For administrator screens, where the real reason matters more than polish (e.g. a 500 because the server could not
 * send the reset e-mail): the generic text, followed by the backend's status and message when it sent one.
 */
export function detailedFailureMessage(error: unknown, fallback: string, forbidden: string) {
  if (error instanceof ApiFailure && error.status !== 403 && error.status !== 409 && error.status !== 422) {
    const detail = error.message && error.message !== fallback ? ` ${error.message}` : "";
    return `${fallback} (${error.status})${detail}`;
  }
  return failureMessage(error, fallback, forbidden);
}
