import { ModuleAlerts } from "@/components/alert/module-alerts";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ModuleAlerts module="recovery" />
    </>
  );
}
