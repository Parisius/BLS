import { signOut } from "@/auth";

/**
 * Where `apiClient` sends a request the backend refused with 401 (token expired, revoked, or account
 * deactivated). Clearing the cookie here matters: the proxy bounces signed-in users off `/login`, so redirecting
 * there with a dead session would loop back into the dashboard.
 */
export async function GET() {
  await signOut({ redirectTo: "/login?expired=1" });
}
