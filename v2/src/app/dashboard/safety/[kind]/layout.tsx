import { ModuleAlerts } from "@/components/alert/module-alerts";
import { isSafetyKind, type SafetyKind } from "@/lib/safety/kinds";

/** Backend alert keys of each safety kind. */
const ALERT_MODULE: Record<SafetyKind, string> = {
  mortgage: "property",
  "movable-safety": "pledge",
  "personal-safety": "personal",
};

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ kind: string }> }) {
  const { kind } = await params;

  return (
    <>
      {children}
      {isSafetyKind(kind) && <ModuleAlerts module={ALERT_MODULE[kind]} />}
    </>
  );
}
