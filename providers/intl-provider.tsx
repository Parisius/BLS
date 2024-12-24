"use client";
import React, { createContext, useEffect, useMemo, useReducer } from "react";
import { IntlProvider as ReactIntlProvider } from "react-intl";
import {
  getDefaultLocale,
  isAvailableLocale,
  loadMessages,
  saveLocale,
} from "@/config/locales/utils";
import { NoSsr } from "@/components/ui/no-ssr";
import { saveLocaleServer } from "@/config/locales/utils/server";
import { useQueryClient } from "@tanstack/react-query";
const localeReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOCALE":
      return isAvailableLocale(action.value)
        ? action.value
        : getDefaultLocale();
    default:
      return state;
  }
};
export const IntlContext = createContext({
  setLocale: () => {},
});
export default function IntlProvider({ children, moduleName }) {
  const [locale, dispatch] = useReducer(localeReducer, getDefaultLocale());
  const queryClient = useQueryClient();
  const messages = useMemo(
    () => loadMessages(moduleName, locale),
    [locale, moduleName]
  );
  const providerValue = useMemo(
    () => ({
      setLocale: (value) => {
        dispatch({ type: "SET_LOCALE", value });
      },
    }),
    []
  );
  useEffect(() => {
    (async () => {
      // await saveLocaleServer(locale);
      // saveLocale(locale);
      await queryClient.invalidateQueries();
    })();
  }, [locale, queryClient]);
  return (
    <NoSsr>
      <ReactIntlProvider locale={locale} messages={messages}>
        <IntlContext.Provider value={providerValue}>
          {children}
        </IntlContext.Provider>
      </ReactIntlProvider>
    </NoSsr>
  );
}
