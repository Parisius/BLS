/**
 * Raw date helpers — no date-fns/react-datepicker. The backend's shared
 * `formatDate` helper (`services/api-sdk/lib/utils/date.ts` in the original
 * app: `format(date, "yyyy-MM-dd")`) sends plain ISO "yyyy-MM-dd" on write,
 * for every module, and returns ISO datetimes on read.
 *
 * Forms use native <input type="date">, which reads/writes plain
 * "yyyy-MM-dd" strings already — no Date object, timezone conversion, or
 * date picker library needed, and no conversion needed on write either.
 */

/** "yyyy-MM-dd" (native date input) -> "yyyy-MM-dd" (backend) — identity, kept as a named step in the write path for clarity at call sites. */
export function toBackendDate(isoDate: string): string {
  return isoDate;
}

/** Any backend datetime (ISO) -> "dd/MM/yyyy" for display. */
export function formatDisplayDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

/** Any backend datetime (ISO) -> "yyyy-MM-dd" to seed a native date input. */
export function toDateInputValue(value?: string | Date | null): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
