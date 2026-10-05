/**
 * Server actions can't rely on thrown errors for user-facing messages: in production Next.js replaces them with a
 * generic one. Actions that need the backend's real message (a 409 "role still in use", a 422 field error...)
 * return this shape instead, and `unwrapResult` turns a failure back into an exception on the client, where the
 * message survives.
 */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string; errors?: Record<string, string[]> };

export class ApiFailure extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiFailure";
  }
}

export function unwrapResult<T>(result: ActionResult<T>): T {
  if (!result.ok) throw new ApiFailure(result.status, result.message, result.errors);
  return result.data;
}
