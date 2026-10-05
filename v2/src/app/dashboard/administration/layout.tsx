import { RequirePermission } from "@/components/auth/require-permission";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RequirePermission anyOf={["user.read", "role.read", "subsidiary.read"]}>{children}</RequirePermission>;
}
