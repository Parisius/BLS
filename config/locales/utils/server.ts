"use server";
import { LOCALE_STORAGE_NAME } from "@/config/locales/utils/index";
import { cookies } from "next/headers";
/**
 * Get the default locale based on the user's browser language.
 * @returns The default locale.
 */
export const getDefaultLocaleServer = async () =>
  cookies().get(LOCALE_STORAGE_NAME)?.value || "en";
/**
 * Save the locale to local storage.
 * @param locale - The locale to save.
 */
// export const saveLocaleServer = async (locale) => {
//   cookies().set(LOCALE_STORAGE_NAME, locale);
// };
