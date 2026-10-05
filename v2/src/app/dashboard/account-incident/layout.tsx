import { RequirePermission } from "@/components/auth/require-permission";
import { ModuleAlerts } from "@/components/alert/module-alerts";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RequirePermission permission="incident.read">
      {children}
      <ModuleAlerts module="incident" />
    </RequirePermission>
  );
}
