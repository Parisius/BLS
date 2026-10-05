import { RequirePermission } from "@/components/auth/require-permission";
import { ModuleAlerts } from "@/components/alert/module-alerts";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RequirePermission permission="litigation.read">
      {children}
      <ModuleAlerts module="litigation" />
    </RequirePermission>
  );
}
