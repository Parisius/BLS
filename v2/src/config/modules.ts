import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookText,
  Briefcase,
  Building2,
  ChartPie,
  ClipboardCheck,
  Home,
  FileWarning,
  Gavel,
  Landmark,
  ScrollText,
  ShieldCheck,
  ShieldPlus,
  Handshake,
  Package,
  Users,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionary";

export interface ModuleTile {
  slug: string;
  href: string;
  nameKey: keyof Dictionary["modules"];
  Icon: LucideIcon;
}

export interface AdministrationModuleTile {
  slug: string;
  href: string;
  nameKey: keyof Dictionary["administrationModules"];
  Icon: LucideIcon;
}

export interface SafetyModuleTile {
  slug: string;
  href: string;
  nameKey: keyof Omit<Dictionary["safetyModules"], "title">;
  Icon: LucideIcon;
}

export interface GovernanceModuleTile {
  slug: string;
  href: string;
  nameKey: keyof Omit<Dictionary["governanceModules"], "title">;
  Icon: LucideIcon;
}

/**
 * Mirrors the original app's config/modules.ts (getModulesData). Only
 * "administration" is wired up to real pages in this rewrite so far — the
 * rest render as tiles for visual parity but are not yet implemented; see
 * v2/README.md. `nameKey` looks up the display name in the active locale's
 * dictionary (src/lib/i18n/dictionary.ts).
 */
export const MODULES: ModuleTile[] = [
  { slug: "governance", href: "/dashboard/governance", nameKey: "governance", Icon: Landmark },
  { slug: "contracts", href: "/dashboard/contract", nameKey: "contracts", Icon: ScrollText },
  { slug: "safety", href: "/dashboard/safety", nameKey: "safety", Icon: ShieldPlus },
  { slug: "account-incidents", href: "/dashboard/account-incident", nameKey: "accountIncidents", Icon: FileWarning },
  { slug: "litigation", href: "/dashboard/litigation", nameKey: "litigation", Icon: Gavel },
  { slug: "recovery", href: "/dashboard/recovery", nameKey: "recovery", Icon: Briefcase },
  { slug: "audit", href: "/dashboard/audit", nameKey: "audit", Icon: ClipboardCheck },
  { slug: "evaluation", href: "/dashboard/evaluation", nameKey: "evaluation", Icon: Award },
  { slug: "legal-monitoring", href: "/dashboard/legal-monitoring", nameKey: "legalMonitoring", Icon: BookText },
  { slug: "text-bank", href: "/dashboard/texts-bank", nameKey: "textBank", Icon: BookText },
];

export const ADMINISTRATION_MODULES: AdministrationModuleTile[] = [
  { slug: "users", href: "/dashboard/administration/users", nameKey: "users", Icon: Users },
  { slug: "roles", href: "/dashboard/administration/roles", nameKey: "roles", Icon: ShieldCheck },
  { slug: "subsidiaries", href: "/dashboard/administration/subsidiaries", nameKey: "subsidiaries", Icon: Landmark },
];

export const GOVERNANCE_MODULES: GovernanceModuleTile[] = [
  { slug: "shareholding", href: "/dashboard/governance/shareholding", nameKey: "shareholding", Icon: ChartPie },
  { slug: "general-meeting", href: "/dashboard/governance/general-meeting", nameKey: "generalMeeting", Icon: Users },
  { slug: "administration-meeting", href: "/dashboard/governance/administration-meeting", nameKey: "administrationMeeting", Icon: Gavel },
  { slug: "management-committee", href: "/dashboard/governance/management-committee", nameKey: "managementCommittee", Icon: Building2 },
];

export const SAFETY_MODULES: SafetyModuleTile[] = [
  { slug: "personal-safety", href: "/dashboard/safety/personal-safety", nameKey: "personalSafety", Icon: Handshake },
  { slug: "movable-safety", href: "/dashboard/safety/movable-safety", nameKey: "movableSafety", Icon: Package },
  { slug: "mortgage", href: "/dashboard/safety/mortgage", nameKey: "mortgage", Icon: Home },
];
