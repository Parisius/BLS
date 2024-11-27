import { FetchService } from "@/services/api-sdk/lib/utils";
import { getToken } from "@/services/auth/helpers";
import { redirect } from "next/navigation";
import { AuthRoutes } from "@/config/routes";
import { getDefaultLocaleServer } from "@/config/locales/utils/server";
/**
 * Fetch service instance
 * @type {FetchService}
 */
export const fetchService = new FetchService({
  baseUrl: process.env.API_URL,
  requestInterceptor: async () => {
    const token = await getToken();
    console.log("token :", token);

    const locale = await getDefaultLocaleServer();
    return {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token.accessToken}` : "",
        "X-Locale": locale,
      },
    };
  },
  responseInterceptor: (response) => {
    if (response.status === 401) {
      redirect(AuthRoutes.logout);
    }
    return response;
  },
});
