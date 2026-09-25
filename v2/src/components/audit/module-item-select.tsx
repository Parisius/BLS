"use client";

import { useMemo } from "react";
import { LinkSelect, type LinkOption } from "@/components/shared/link-select";
import { useAllContracts } from "@/lib/contract/hooks";
import { useAllLitigation } from "@/lib/litigation/hooks";
import { useAllGuarantees } from "@/lib/safety/hooks";
import { useAllIncidents } from "@/lib/account-incident/hooks";
import { useAllRecoveries } from "@/lib/recovery/hooks";
import { useAllMeetings as useAllGeneralMeetings } from "@/lib/governance/general-meeting/hooks";
import { useAllMeetings as useAllBoardMeetings } from "@/lib/governance/administration-meeting/hooks";
import { useAllMeetings as useAllCommitteeMeetings } from "@/lib/governance/management-committee/hooks";
import type { AuditModule } from "@/lib/audit/constants";
import { useDictionary } from "@/lib/i18n/locale-provider";

type Source = { data?: { id: string; title: string }[]; isLoading: boolean };

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
}

// One component per source so only the picked module's list is fetched (hooks can't be called conditionally).
function ItemSelect({ source, ...props }: SelectProps & { source: Source }) {
  const { t } = useDictionary();
  const ta = t.audit.addAudit;
  const options = useMemo<LinkOption[]>(() => (source.data ?? []).map(({ id, title }) => ({ id, title })), [source.data]);
  return (
    <LinkSelect
      {...props}
      options={options}
      isLoading={source.isLoading}
      placeholder={ta.selectItem}
      loadingLabel={ta.loading}
      emptyLabel={ta.noItems}
    />
  );
}

const Contracts = (p: SelectProps) => <ItemSelect {...p} source={useAllContracts()} />;
const Litigations = (p: SelectProps) => <ItemSelect {...p} source={useAllLitigation()} />;
const Mortgages = (p: SelectProps) => <ItemSelect {...p} source={useAllGuarantees("mortgage")} />;
const PersonalSafeties = (p: SelectProps) => <ItemSelect {...p} source={useAllGuarantees("personal-safety")} />;
const MovableSafeties = (p: SelectProps) => <ItemSelect {...p} source={useAllGuarantees("movable-safety")} />;
const Incidents = (p: SelectProps) => <ItemSelect {...p} source={useAllIncidents()} />;
const Recoveries = (p: SelectProps) => <ItemSelect {...p} source={useAllRecoveries()} />;

function useBothStatuses(pending: Source, closed: Source): Source {
  return useMemo(
    () => ({ data: [...(pending.data ?? []), ...(closed.data ?? [])], isLoading: pending.isLoading || closed.isLoading }),
    [pending.data, pending.isLoading, closed.data, closed.isLoading],
  );
}

// Meetings are audited whether they are still open or already closed.
function GeneralMeetings(p: SelectProps) {
  return <ItemSelect {...p} source={useBothStatuses(useAllGeneralMeetings("pending"), useAllGeneralMeetings("closed"))} />;
}
function BoardMeetings(p: SelectProps) {
  return <ItemSelect {...p} source={useBothStatuses(useAllBoardMeetings("pending"), useAllBoardMeetings("closed"))} />;
}
function CommitteeMeetings(p: SelectProps) {
  return (
    <ItemSelect {...p} source={useBothStatuses(useAllCommitteeMeetings("pending"), useAllCommitteeMeetings("closed"))} />
  );
}

const SOURCES: Record<AuditModule, (props: SelectProps) => React.ReactElement> = {
  contracts: Contracts,
  litigation: Litigations,
  conventionnal_hypothec: Mortgages,
  guarantees_security_personal: PersonalSafeties,
  guarantees_security_movable: MovableSafeties,
  incidents: Incidents,
  recovery: Recoveries,
  general_meeting: GeneralMeetings,
  session_administrators: BoardMeetings,
  management_committees: CommitteeMeetings,
};

/**
 * The record an audit is about. The original only listed items for 5 of the 10 modules (safeties and the
 * three governance bodies always showed an empty list), so those modules couldn't actually be audited.
 */
export function ModuleItemSelect({ module, ...props }: SelectProps & { module: AuditModule }) {
  const Source = SOURCES[module];
  return <Source key={module} {...props} />;
}
