import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Credentials login hits the backend's `POST /login` directly (see
 * openapi.json) rather than going through `apiClient`, since `apiClient`'s
 * auth middleware calls `auth()` itself — that would be circular here.
 */
async function login(username: string, password: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const { data } = await response.json();
    return data?.access_token as string | undefined;
  } catch {
    // Backend unreachable (network error, DNS failure, etc.) — treat the
    // same as invalid credentials rather than letting Auth.js surface an
    // opaque "Configuration" error to the user.
    return null;
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
          return null;
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
