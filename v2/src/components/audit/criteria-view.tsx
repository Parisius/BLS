"use client";

import { CriteriaManager } from "@/components/shared/criteria-manager";
import {
  useAllAuditCriteria,
  useCreateAuditCriteria,
  useDeleteAuditCriteria,
  useUpdateAuditCriteria,
} from "@/lib/audit/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

/** Criteria of one audited module, with add / edit / delete. */
export function CriteriaView({ module, label }: { module: string; label: string }) {
  const { t } = useDictionary();
  const { data, isLoading, isError } = useAllAuditCriteria(module);
  const { mutateAsync: create } = useCreateAuditCriteria(module);
  const { mutateAsync: update } = useUpdateAuditCriteria(module);
  const { mutateAsync: remove } = useDeleteAuditCriteria();

  return (
    <CriteriaManager
      label={label}
      labels={t.audit.criteria}
      typeLabels={t.audit.criteriaTypes}
      errorLabel={t.common.loadError}
      criteria={data}
      isLoading={isLoading}
      isError={isError}
      onCreate={create}
      onUpdate={(id, values) => update({ criteriaId: id, args: values })}
      onDelete={remove}
    />
  );
}
