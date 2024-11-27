import { clsx, type ClassValue } from "clsx";
import {
  format,
  formatDuration as formatDurationFns,
  intervalToDuration,
} from "date-fns";
import dompurify from "dompurify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Change the timezone of a date from local to UTC
 * @param date - The date to change the timezone of
 * @returns The date with the timezone changed to UTC
 */
export const changeTmzFromLocalToUTC = (date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000);
/**
 * Format a date to a string
 * @param date - The date to format
 * @returns The formatted date
 */
export const formatDate = (date) => format(date, "dd/MM/yyyy");
/**
 * Format a duration
 * @param start - The start date
 * @param end - The end date
 * @param options - The options to format the duration
 * @returns The formatted duration
 */
export const formatDuration = (start, end, options) =>
  formatDurationFns(
    intervalToDuration({
      start,
      end,
    }),
    {
      locale: {
        formatDistance: (token, count) => {
          switch (token) {
            case "xYears":
              return count === 1 ? "1 an" : `${count} ans`;
            case "xMonths":
              return count === 1 ? "1 mois" : `${count} mois`;
            case "xDays":
              return count === 1 ? "1 jour" : `${count} jours`;
            default:
              return "";
          }
        },
      },
      ...options,
    }
  );
/**
 * Format currency amount
 * @param amount - The amount to format
 * @returns The formatted amount
 */
export const formatAmount = (amount) =>
  amount.toLocaleString("fr-FR", {
    style: "currency",
    currency: "XOF",
    currencyDisplay: "code",
  });
/**
 * Format a number
 * @param value - The number to format
 * @returns The formatted number
 */
export const formatNumber = (value) => value.toLocaleString("fr-FR");
/**
 * Sanitize HTML content
 * @param content - The content to sanitize
 * @returns The sanitized content
 */
export const { sanitize } = dompurify;
