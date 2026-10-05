import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getTenantSlug } from "@/lib/tenant";

/**
 * Credentials login hits the backend's `POST /login` directly (see
 * openapi.json) rather than going through `apiClient`, since `apiClient`'s
 * auth middleware calls `auth()` itself — that would be circular here.
 */
/** Carries the reason a sign-in failed to the login form (`result.code` on the client). */
class LoginError extends CredentialsSignin {
  constructor(code: "invalid_credentials" | "invalid_data" | "tenant_not_found" | "unreachable") {
    super();
    this.code = code;
  }
}

async function login(username: string, password: string) {
  try {
    const tenant = await getTenantSlug();
    const response = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(tenant && { "X-Tenant": tenant }),
      },
      body: JSON.stringify({ username, password, ...(tenant && { tenant }) }),
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 422) throw new LoginError("invalid_data");
      const body = (await response.json().catch(() => null)) as { code?: string } | null;
      if (response.status === 404 || body?.code === "tenant_not_found") throw new LoginError("tenant_not_found");
      throw new LoginError("invalid_credentials");
    }

    const { data } = await response.json();
    return data?.access_token as string | undefined;
  } catch (error) {
    if (error instanceof LoginError) throw error;
    // Backend unreachable (network error, DNS failure, etc.): say so, rather than letting Auth.js surface an
    // opaque "Configuration" error or pretending the credentials were wrong.
    throw new LoginError("unreachable");
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!username || !password) {
          return null;
        }

        const accessToken = await login(username, password);
        if (!accessToken) {
          throw new LoginError("invalid_credentials");
        }

        return { id: username, name: username, accessToken };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
});
